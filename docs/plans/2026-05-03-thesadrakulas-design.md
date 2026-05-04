# thesadrakulas.com — Design Doc

**Date:** 2026-05-03
**Couple:** Sydney Ann Krause × Trenton Logan Sadrakula
**Date of wedding:** Saturday, 7 November 2026 (16:00 CST)
**Locale:** Kansas City, Missouri

## 1. Brand & Tone

Editorial — Vanity Fair / Vogue / YSL aesthetic. Locked from the design reference in `~/Downloads/Wedding Website/`.

- **Palette:** light only. `--paper #f5f2ec`, `--ink #0a0a0a`, `--cream #faf7f1`, `--paper-warm #ebe6db`, `--muted #6b6560`, `--hairline rgba(10,10,10,0.12)`. No dark mode, no theme picker.
- **Typography:** committed to one stack — no typeface picker.
  - Display: **Bodoni Moda** (variable, opsz 96)
  - Serif body: **Cormorant Garamond**
  - Script (names, accents): **Italianno**
  - Sans (eyebrows, UI): **Inter**
  - Loaded via `next/font/google` — self-hosted, FOIT-free.
- **Motion vibe:** cinematic (B). Hero parallax, scroll-driven countdown ticks, image scrub on the story page, staggered party reveals. `prefers-reduced-motion: reduce` collapses every effect to a 150ms opacity fade.

## 2. Architecture

### Stack
- **Next.js 16.2.4** App Router (pre-installed). React 19. Tailwind v4.
- **Bun** for runtime, package manager, and tests (`bun test`).
- **motion** (`motion/react`) for all animations.
- **TypeScript** strict.
- **Hosting:** Vercel (assumed). 95% SSG; RSVP via Server Actions on Node runtime.

### Routing (App Router)
```
app/
  layout.tsx              # masthead + footer + fonts
  page.tsx                # / — Home
  story/page.tsx          # /story
  details/page.tsx        # /details
  party/page.tsx          # /party
  registry/page.tsx       # /registry
  rsvp/page.tsx           # /rsvp (client island for the wizard)
  rsvp/actions.ts         # Server Actions (lookup, submit)
  globals.css
  fonts.ts                # next/font definitions
content/
  site.ts                 # date, venues, copy
  story.ts                # chapters
  details.ts              # schedule, hotels, dress code
  party.ts                # bridesmaids, groomsmen, parents, principals
  registry.ts             # registry cards + venmo handle
components/
  Masthead.tsx
  Footer.tsx
  Monogram.tsx
  motion/
    FadeIn.tsx            # whileInView fade-up wrapper
    Parallax.tsx          # useScroll/useTransform wrapper
    Countdown.tsx         # client-only ticker
  hero/HomeHero.tsx
  ...
lib/
  rsvp/
    sheet.ts              # Google Sheets client (server-only)
    match.ts              # fuzzy name matcher
    schema.ts             # zod types
docs/plans/
  2026-05-03-thesadrakulas-design.md   # this doc
```

All page routes are static (`export const dynamic = 'force-static'`). Only `rsvp/actions.ts` runs on Node at request time.

### Content model
All copy lives in `content/*.ts` as typed exports. To update, push a PR. No CMS.

```ts
// content/site.ts
export const SITE = {
  bride: 'Sydney Ann Krause',
  groom: 'Trenton Logan Sadrakula',
  weddingDate: new Date('2026-11-07T16:00:00-06:00'),
  rsvpDeadline: new Date('2026-10-01T23:59:59-06:00'),
  ceremony: { name: 'Country Club Christian Church', address: '6101 Ward Parkway · Kansas City, Missouri', time: '4:00 p.m.' },
  reception: { name: 'Indian Hills Country Club', address: '6847 Tomahawk Road · Mission Hills, Kansas', time: '5:30 p.m.' },
  city: 'Kansas City, Missouri',
} as const;
```

## 3. Page Inventory

| Route | Source ref | Notes |
|---|---|---|
| `/` (Home) | `HomePage.jsx` | Hero with placeholder portrait gradient, countdown bar, editorial intro, departments grid |
| `/story` | `StoryPage.jsx` | Three chapters, pull quote, image scrub on scroll |
| `/details` | `DetailsPage.jsx` | Two-card ceremony/reception, schedule timeline, dress code, hotels |
| `/party` | `PartyPage.jsx` | Bride/groom feature, bridesmaids, groomsmen, parents |
| `/registry` | `RegistryPage.jsx` | Six registry cards (TBD URLs) + Venmo card (TBD handle) |
| `/rsvp` | `RsvpPage.jsx` | Multi-step wizard, Google Sheets-backed |

Masthead is a sticky top nav with the six links in spaced caps (Inter, 11px, 0.28em letter-spacing). Footer carries ceremony + reception meta plus the SADRAKULAS wordmark.

## 4. RSVP Flow

### Sheet Schema (Google Sheets)
A single tab named `Guests`. Columns:

| col | name | type | notes |
|---|---|---|---|
| A | partyId | string | groups invitees per envelope, e.g. `P-014` |
| B | partyLabel | string | display label (e.g. `The Hayes Family`) |
| C | firstName | string | |
| D | lastName | string | |
| E | relationship | enum | `primary` / `spouse` / `plus-one` / `child` |
| F | side | enum | `bride` / `groom` / `both` |
| G | attending | enum | `` (empty) / `yes` / `no` |
| H | meal | enum | `` / `chicken` / `pork` / `vegetarian` |
| I | dietary | string | optional notes |
| J | noteToCouple | string | populated only on the partyId's primary row |
| K | submittedAt | ISO timestamp | |

Trenton/Sydney maintain columns A–F manually. Server Actions write G–K.

### Match strategy
**Fuzzy match on `firstName`, `lastName`, or `partyLabel`** — case-insensitive substring with token-aware scoring. Returns up to 5 candidate parties grouped by `partyId`. Guest picks their party; the form lists every row in that party for individual yes/no/meal answers.

```ts
// lib/rsvp/match.ts (sketch)
export function matchParties(query: string, rows: GuestRow[]): Party[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const score = (text: string) => {
    const t = text.toLowerCase();
    if (t === q) return 100;
    if (t.startsWith(q)) return 80;
    if (t.includes(q)) return 50;
    return 0;
  };
  // ... group by partyId, dedupe, sort by max member score
}
```

### Form steps
0. **Search** — type a name, see matched parties as cards.
1. **Confirm** — show the party as an editorial "invitation" card (Italianno names).
2. **Attending** — per row: Joyfully accepts / Regretfully declines.
3. **Meal** — only for those attending: chicken / pork / vegetarian + dietary notes (one shared field per party).
4. **Note** — optional textarea, one per party.
5. **Success** — Italianno "Thank you" + monogram.

Plus-ones are already rows in the sheet (flagged `relationship: plus-one`). The form just iterates rows; we render a subtle "+1 of [primary]" badge but the inputs are identical.

### Server Actions
```ts
// app/rsvp/actions.ts
'use server';
export async function lookupParties(query: string): Promise<Party[]>
export async function submitRsvp(payload: RsvpPayload): Promise<{ ok: boolean }>
```

Auth: Google service account (JSON key in `GOOGLE_SERVICE_ACCOUNT_JSON`). Sheet ID in `RSVP_SHEET_ID`. Both env vars set in Vercel and `.env.local`.

Library: `googleapis` (server-only import, never bundled to client). Reads via `spreadsheets.values.get`, writes via `spreadsheets.values.batchUpdate`.

Idempotency: a party may RSVP again. The submit action overwrites G–K for the party's rows.

Validation: zod schema rejecting unknown meal codes, missing partyId, etc.

## 5. Motion Spec (cinematic)

| Where | Effect | Library |
|---|---|---|
| Hero names | Italianno script rises 24px on mount with stagger by character group | `motion` `initial`/`animate` |
| Hero subtitle | parallax-y on scroll (`useScroll`, `useTransform`) | |
| Countdown digits | each digit `whileInView` with rotateX flip | |
| Story page hero image | scroll-scrub scale 1.0 → 1.08 within viewport | `useScroll target:ref` |
| Pull quote | `whileInView` fade-up with 0.4s ease-out | |
| Party cards | staggered grid with `staggerChildren: 0.06` | |
| Page transitions | route-level fade (200ms in, instant out) via a layout wrapper | `AnimatePresence` |
| Buttons | `whileHover` 1.02 scale + ink fill (existing `.btn` styling) | |

Every effect wraps in `useReducedMotion()` — when reduced, fall back to instant or 150ms fade.

## 6. Verification & Audit Loop

After each iteration:
1. `bun run dev` (Next dev server).
2. **Playwright MCP** against http://localhost:3000:
   - Navigate every page.
   - `browser_console_messages` to verify zero errors/warnings.
   - `browser_snapshot` on each route.
   - Walk RSVP wizard end-to-end (search → confirm → attending → meal → note → submit) against a test sheet.
3. Run **`vercel-react-best-practices`** skill on changed files; fix flagged issues.
4. `bun test` for unit tests (matcher, schema validators).
5. `bun run build` to catch SSG regressions before commit.

## 7. Open Items (assumptions, fillable later)

- **Domain:** TBD. Defaulting to `thesadrakulas.com` — set up later.
- **GitHub remote:** user will create. After v1 ships locally, run `gh repo create` + `git push -u`.
- **Photography:** all images remain striped editorial placeholders (`.img-ph` with `data-label`) until Sydney delivers.
- **Registry URLs:** `null` initially in `content/registry.ts`. Cards still render with "coming soon" treatment; they become real anchors when populated.
- **Venmo handle:** same — `null` until known. Card hides the CTA until populated.
- **Real meal options:** `chicken / pork / vegetarian` per Trenton's confirmation.
- **No email/SMS confirmations in v1.** RSVP returns a success screen only.

## 8. Non-Goals (YAGNI)

- No CMS / Sanity (the MCP is in env but unused).
- No theme picker, no typeface picker.
- No login/auth — RSVP is name-gated only.
- No analytics, no GDPR banner (US-only audience).
- No i18n (English only).
- No rehearsal-dinner or brunch RSVP flows.
- No photo upload for guests, no live event slideshow.
- No PWA / offline / push notifications.

## 9. Implementation Order

1. **Bootstrap** — install `motion`, `googleapis`, `zod`. Replace `app/page.tsx`, `globals.css`, `layout.tsx` with the editorial frame.
2. **Tokens & primitives** — port `styles.css` to globals (CSS custom properties + Tailwind theme), build `Masthead`, `Footer`, `Monogram`, `FadeIn`, `Parallax`.
3. **Static pages** — Home, Details, Party, Story, Registry. Place editorial copy from `content/*.ts`.
4. **RSVP wizard (frontend)** — UI states wired to a stub action.
5. **RSVP backend** — Sheets client, lookup + submit Server Actions, env wiring.
6. **Motion polish pass** — apply spec, verify reduced-motion.
7. **Audit loop** — Playwright walk + vercel-react-best-practices.
8. **Ship local** — push to GitHub when remote is ready.
