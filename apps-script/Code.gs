/**
 * RSVP Apps Script web app for the "Guests" Google Sheet.
 *
 * Deploy this as a Web app (Execute as: Me, Who has access: Anyone) and put the
 * resulting /exec URL in RSVP_APPS_SCRIPT_URL. The TOKEN below MUST equal
 * RSVP_APPS_SCRIPT_TOKEN in the site env (.env.local locally + Vercel in prod).
 *
 * See docs/rsvp-apps-script-setup.md for full setup instructions.
 */

// IMPORTANT: this must equal RSVP_APPS_SCRIPT_TOKEN in the site env.
var TOKEN = "REPLACE_WITH_YOUR_SHARED_SECRET";
var SHEET_NAME = "Guests";

/**
 * Handle an RSVP write. The site server POSTs:
 *   { token: <shared secret>, payload: <RsvpPayload> }
 * where RsvpPayload = {
 *   partyId: string,
 *   noteToCouple?: string|null,
 *   answers: Array<{ rowIndex, attending, meal?, dietary? }>
 * }
 * rowIndex is the literal sheet row number (header is row 1, data starts row 2).
 * For each answer we set columns G..K (7..11) of that row to:
 *   [attending, meal||"", dietary||"", note, submittedAt]
 * "note" is payload.noteToCouple only on the first answer (index 0), "" otherwise.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    var body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonOutput({ ok: false, error: "Invalid JSON body" });
    }

    if (!body || body.token !== TOKEN) {
      return jsonOutput({ ok: false, error: "Unauthorized" });
    }

    var payload = body.payload;
    if (
      !payload ||
      typeof payload.partyId !== "string" ||
      payload.partyId.length === 0 ||
      !Array.isArray(payload.answers) ||
      payload.answers.length === 0
    ) {
      return jsonOutput({ ok: false, error: "Invalid payload" });
    }

    var sheet = getDataSheet_();
    if (!sheet) {
      return jsonOutput({ ok: false, error: "Guest sheet not found (is this script bound to the Guests spreadsheet?)" });
    }

    var submittedAt = new Date().toISOString();
    var answers = payload.answers;
    var i;

    // SAFETY GUARD: validate everything before writing anything. For each answer
    // confirm rowIndex is an integer >= 2 and that column A of that row equals
    // payload.partyId. If ANY mismatch, write nothing and return an error.
    for (i = 0; i < answers.length; i++) {
      var rowIndex = answers[i].rowIndex;
      if (typeof rowIndex !== "number" || rowIndex % 1 !== 0 || rowIndex < 2) {
        return jsonOutput({
          ok: false,
          error: "Invalid rowIndex at answer " + i + ": " + rowIndex,
        });
      }
      var existing = sheet.getRange(rowIndex, 1, 1, 11).getValues()[0];
      var cellPartyId = String(existing[0]);
      if (cellPartyId !== payload.partyId) {
        return jsonOutput({
          ok: false,
          error:
            "partyId mismatch at row " +
            rowIndex +
            ": sheet has '" +
            cellPartyId +
            "', payload has '" +
            payload.partyId +
            "'. Nothing was written.",
        });
      }
      // Block overwrites: if this row already has a submittedAt (col K), the
      // party has already responded. Clear columns G:K for the party in the
      // sheet to let them respond again.
      if (String(existing[10]).length > 0) {
        return jsonOutput({
          ok: false,
          error:
            "Party " +
            payload.partyId +
            " has already responded. Nothing was written.",
        });
      }
    }

    // All valid — write columns G..K (7..11) for each answer.
    for (i = 0; i < answers.length; i++) {
      var answer = answers[i];
      var attending = answer.attending === "no" ? "no" : "yes";
      var meal = answer.meal || "";
      var dietary = answer.dietary || "";
      var note = i === 0 ? payload.noteToCouple || "" : "";
      sheet
        .getRange(answer.rowIndex, 7, 1, 5)
        .setValues([[attending, meal, dietary, note, submittedAt]]);
    }

    return jsonOutput({ ok: true, count: answers.length });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Token-gated roster export for scripts/sync-guests.mjs.
 * Reads columns A:F for rows 2..lastRow, skips rows whose partyId (col A) is
 * blank, and returns { ok:true, roster:[...] } in sheet order.
 */
function doGet(e) {
  try {
    if (!e || !e.parameter || e.parameter.token !== TOKEN) {
      return jsonOutput({ ok: false, error: "Unauthorized" });
    }

    var sheet = getDataSheet_();
    if (!sheet) {
      return jsonOutput({ ok: false, error: "Guest sheet not found (is this script bound to the Guests spreadsheet?)" });
    }

    // action=status: return the partyIds that have already responded (any row of
    // the party has a non-empty submittedAt in column K). The site uses this to
    // block already-responded parties in the name lookup.
    if (e.parameter.action === "status") {
      var lastRowS = sheet.getLastRow();
      var statusRows = lastRowS < 2 ? [] : sheet.getRange(2, 1, lastRowS - 1, 11).getValues();
      var seen = {};
      var submittedPartyIds = [];
      for (var s = 0; s < statusRows.length; s++) {
        var spid = String(statusRows[s][0]);
        var ssub = String(statusRows[s][10]);
        if (spid.length > 0 && ssub.length > 0 && !seen[spid]) {
          seen[spid] = true;
          submittedPartyIds.push(spid);
        }
      }
      return jsonOutput({ ok: true, submittedPartyIds: submittedPartyIds });
    }

    var lastRow = sheet.getLastRow();
    var roster = [];
    if (lastRow >= 2) {
      var values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
      for (var i = 0; i < values.length; i++) {
        var r = values[i];
        var partyId = String(r[0]);
        if (partyId.length === 0) {
          continue;
        }
        roster.push({
          partyId: partyId,
          partyLabel: String(r[1]),
          firstName: String(r[2]),
          lastName: String(r[3]),
          relationship: String(r[4]),
          side: String(r[5]),
        });
      }
    }

    return jsonOutput({ ok: true, roster: roster });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
}

/**
 * Resolve the guest data tab. Prefers a tab named SHEET_NAME, then any tab whose
 * header cell A1 is "partyId", then the first tab. Returns null only when the
 * script isn't bound to a spreadsheet at all.
 */
function getDataSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return null;
  var named = ss.getSheetByName(SHEET_NAME);
  if (named) return named;
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (String(sheets[i].getRange(1, 1).getValue()).trim() === "partyId") {
      return sheets[i];
    }
  }
  return sheets.length ? sheets[0] : null;
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
