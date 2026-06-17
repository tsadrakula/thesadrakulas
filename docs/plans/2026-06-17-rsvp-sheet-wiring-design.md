# RSVP sheet wiring — design record (2026-06-17)

## Decision

Replace the service-account approach to the **Guests** Google Sheet with a split
transport:

- **Reads (name lookup)** come from a committed mirror, `lib/rsvp/guests.ts`,
  which exports `getRosterGuests(): GuestRow[]`. No live API call, no
  credentials, fast and reliable at request time. The mirror is regenerated from
  the sheet on demand with `npm run sync-guests`.
- **Writes (RSVP submit)** go to the sheet through a **Google Apps Script web
  app** bound to the sheet. The site server POSTs the RSVP payload plus a shared
  secret; the Apps Script validates and writes the row.

This removes the `@googleapis/sheets` + `google-auth-library` service-account
dependency for the request path. The Apps Script executes as the sheet owner, so
no separate service-account sharing/credentials management is needed.

## Data contract

### Sheet "Guests" columns (header row 1, data from row 2)

| Col | Field        |
| --- | ------------ |
| A   | partyId      |
| B   | partyLabel   |
| C   | firstName    |
| D   | lastName     |
| E   | relationship |
| F   | side         |
| G   | attending    |
| H   | meal         |
| I   | dietary      |
| J   | noteToCouple |
| K   | submittedAt  |

### rowIndex by position

`getRosterGuests()` assigns `rowIndex = position + 2` (header is row 1). The
`RsvpPayload.answers[].rowIndex` **is** the literal sheet row number. The mirror
order therefore must always equal the sheet's row order — see the drift caveat.

### Write wire format

Server POSTs JSON to `RSVP_APPS_SCRIPT_URL` with `Content-Type: application/json`
and body exactly:

```json
{ "token": "<RSVP_APPS_SCRIPT_TOKEN>", "payload": <RsvpPayload> }
```

`RsvpPayload` (`lib/rsvp/schema.ts`):

```ts
{
  partyId: string,
  noteToCouple?: string | null,
  answers: Array<{
    rowIndex: number,
    attending: "yes" | "no",
    meal?: "chicken" | "pork" | "vegetarian" | null,
    dietary?: string | null
  }>
}
```

### Write mapping (inside the Apps Script)

For each answer, the script sets columns **G..K (7..11)** of `answer.rowIndex` to:

```
[ attending, meal||"", dietary||"", note, submittedAt ]
```

- `attending` is coerced to `"no"` only when exactly `"no"`, else `"yes"`.
- `note` = `payload.noteToCouple || ""` on the **first** answer (index 0) only;
  `""` for the rest.
- `submittedAt` is generated **server-side in the Apps Script** as
  `new Date().toISOString()`.

### partyId write guard (fail-safe against row drift)

Before writing anything, the Apps Script loops over all answers and verifies:

1. each `rowIndex` is an integer `>= 2`, and
2. column A of that row equals `payload.partyId`.

If **any** check fails, the script writes **nothing** and returns a JSON error.
It also rejects when `token !== TOKEN`. Writes run under a `LockService` script
lock (`waitLock(30000)`, released in `finally`) to avoid concurrent clobbering.

### Roster export (read path for the sync script)

The Apps Script `doGet` is token-gated. It reads columns A:F for rows
2..`getLastRow()`, skips rows whose partyId is blank, and returns
`{ ok:true, roster:[ {partyId, partyLabel, firstName, lastName, relationship, side}, ... ] }`
in sheet order. `scripts/sync-guests.mjs` consumes this to rebuild the mirror.

## Environment variables (the only two)

- `RSVP_APPS_SCRIPT_URL` — the deployed Apps Script `/exec` URL.
- `RSVP_APPS_SCRIPT_TOKEN` — the shared secret; must equal the `TOKEN` constant
  in the Apps Script.

Both live in `.env.local` (local) and in the Vercel project env (production).

## Files added / changed

Added (owned by this change, agent W2):

- `apps-script/Code.gs` — the Apps Script web app: `doPost` (validated,
  guarded, locked RSVP write), `doGet` (token-gated roster export), and a
  `jsonOutput` helper. Holds the `TOKEN` and `SHEET_NAME = "Guests"` constants.
- `scripts/sync-guests.mjs` — Node ESM sync script (`npm run sync-guests`):
  parses `.env.local`, fetches the roster via `doGet`, validates each row
  (non-empty fields; relationship in {primary,spouse,plus-one,child}; side in
  {bride,groom,both}), and overwrites `lib/rsvp/guests.ts` **byte-for-byte** in
  the existing format so an unchanged sheet produces zero git diff. Prints the
  guest and party counts.
- `docs/rsvp-apps-script-setup.md` — non-developer setup/operations guide.
- `docs/plans/2026-06-17-rsvp-sheet-wiring-design.md` — this design record.

Changed:

- `package.json` — added the `sync-guests` script (`node scripts/sync-guests.mjs`).

Reference only (owned by another agent — not modified here):

- `lib/rsvp/guests.ts` — the committed mirror (already created).
- `lib/rsvp/schema.ts` — the zod schema / wire types.
- `app/rsvp/actions.ts`, `lib/rsvp/sheet.ts` — the server write path that POSTs
  to the Apps Script.

## Testing plan

- **Local name lookups** against the committed mirror (no network):
  - Trenton — `P-097` (Trenton Sadrakula, groom side).
  - Sydney — `P-002` (Sydney Krause, bride side).
  Confirm the wizard finds each party and assigns the correct `rowIndex`
  (Trenton's row is position-derived from the mirror; the partyId guard will
  validate it on write).
- **Mirror reproduction**: re-running `npm run sync-guests` on an unchanged
  sheet must yield zero `git diff` on `lib/rsvp/guests.ts`. (Verified: the
  builder regenerates all 250 existing rows byte-identically.)
- **End-to-end write (once deployed)**: submit a real RSVP and confirm columns
  G–K populate on the matching sheet row, with `submittedAt` set and the note
  only on the party's first member.
- **Guard behavior**: a payload whose `rowIndex` partyId does not match column A
  must write nothing and return an error.

## Row-order drift caveat

`rowIndex` is fixed by each guest's **position** in `lib/rsvp/guests.ts`, which
must mirror the sheet's row order. Reordering, inserting, or deleting rows in the
Guests tab shifts those positions ("drift") and would aim writes at the wrong
rows. The partyId write guard makes this **fail safe** (an error, not silent
corruption) rather than safe outright. The fix is operational: after any row
reorder/insert/delete, run `npm run sync-guests` and redeploy. Never change row
order without re-syncing.
