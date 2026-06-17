# RSVP Google Sheet wiring — Apps Script setup

This guide is for a non-developer. It connects the wedding site's RSVP form to
the **Guests** Google Sheet so that when someone RSVPs, their answers land in
the sheet automatically.

How it works in one sentence: the site **reads** guest names from a committed
copy of the sheet (`lib/rsvp/guests.ts`) and **writes** RSVP answers back to the
sheet through a small Google Apps Script "web app" that lives inside the sheet.

You only need to do steps 1–5 once. Steps 6–8 are for testing and ongoing care.

---

## 1. Open the Apps Script editor

1. Open the **Guests** Google Sheet in your browser.
2. In the top menu, click **Extensions → Apps Script**.
3. A new tab opens with a code editor. If there is a file called `Code.gs`
   with some starter code, you'll replace its contents in the next step.

## 2. Paste the script

1. In this project, open `apps-script/Code.gs`.
2. Select **all** of its contents and copy them.
3. Back in the Apps Script editor, select all of the existing `Code.gs`
   contents, delete them, and paste what you copied.

## 3. Set the secret TOKEN

1. Near the top of the pasted code you'll see this line:

   ```js
   var TOKEN = "REPLACE_WITH_YOUR_SHARED_SECRET";
   ```

2. Replace `REPLACE_WITH_YOUR_SHARED_SECRET` with a **long random secret** —
   for example a 40+ character string of random letters and numbers. (You can
   generate one with a password manager.) Keep it between the quotes.
3. **Write this token down somewhere safe.** You'll paste the exact same value
   into the site's environment in step 5. The site and the script must use the
   identical token or every submission will be rejected.
4. Click the **Save** icon (floppy disk) in the Apps Script toolbar.

## 4. Deploy as a Web app

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** anything, e.g. "RSVP writer".
   - **Execute as:** **Me** (your Google account).
   - **Who has access:** **Anyone**.
4. Click **Deploy**.
5. Google will ask you to **authorize** the script to access your spreadsheet.
   Click through: choose your account, click **Advanced → Go to (project)** if
   warned, and **Allow**. (This is expected; it's your own script.)
6. After deploying you'll see a **Web app URL** ending in `/exec`. Click
   **Copy**. This is your `RSVP_APPS_SCRIPT_URL`.

## 5. Put the URL and token into the site

The site reads two environment variables — and only these two:

- `RSVP_APPS_SCRIPT_URL` — the `/exec` URL you just copied.
- `RSVP_APPS_SCRIPT_TOKEN` — the **same** secret you typed into the `TOKEN`
  line in step 3.

Set both in **two** places:

1. **Local development** — in the file `.env.local` at the project root:

   ```
   RSVP_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfyc.../exec
   RSVP_APPS_SCRIPT_TOKEN=your-long-random-secret
   ```

2. **Production (Vercel)** — in the Vercel project: **Settings → Environment
   Variables**, add the same two variables, then **redeploy** the site so the
   new values take effect.

## 6. Test a submission

1. Run the site (locally `npm run dev`, or use the deployed site) and open the
   RSVP page.
2. Look yourself up, mark attending / not attending, pick a meal, and submit.
3. Open the **Guests** sheet and find your row. Columns **G–K** should now be
   filled in:
   - **G attending** — `yes` or `no`
   - **H meal** — e.g. `chicken` (blank if not attending)
   - **I dietary** — any note you typed (or blank)
   - **J noteToCouple** — your note to the couple (only on the first person in
     your party; blank for the others)
   - **K submittedAt** — a timestamp the script fills in automatically

   If the columns filled in, you're done. If you got an error, double-check
   that the `TOKEN` in the script matches `RSVP_APPS_SCRIPT_TOKEN` exactly.

## 7. Re-syncing guest names after editing the sheet

The site reads guest **names** from a committed copy, not live from the sheet.
After you add, rename, or change guests in the **Guests** sheet, refresh that
copy by running, from the project root:

```
npm run sync-guests
```

This pulls the current roster from the sheet (via the same web app, using
`RSVP_APPS_SCRIPT_URL` + `RSVP_APPS_SCRIPT_TOKEN` from `.env.local`) and rewrites
`lib/rsvp/guests.ts`. Commit and deploy the change for it to appear on the site.

### IMPORTANT: do not reorder, insert, or delete rows without re-syncing

The site writes each RSVP back to a specific **row number** in the sheet. That
row number is fixed by each guest's **position** in `lib/rsvp/guests.ts`. If you
**reorder, insert, or delete rows** in the Guests tab, those positions shift
("row drift") and the site would aim at the wrong rows.

To stay safe: after any row reorder/insert/delete, **immediately run
`npm run sync-guests`** and redeploy. As a safety net, the script checks that
column A (partyId) of each target row matches before writing — so if rows have
drifted, a submission **fails safely with an error instead of corrupting the
wrong guest's row**. Re-syncing clears the drift.

## 8. Changing the script later

Whenever you edit the Apps Script code, the change does **not** go live until
you create a new deployment version:

- **Deploy → Manage deployments**, click the pencil (edit), set **Version** to
  **New version**, and click **Deploy**; or
- **Deploy → New deployment** and create a fresh Web app deployment (this gives
  a new `/exec` URL, which you'd then update in step 5).

Simply saving the code in the editor is **not** enough for the live site.
