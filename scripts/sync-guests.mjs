// Sync the committed guest roster mirror (lib/rsvp/guests.ts) from the "Guests"
// Google Sheet via the Apps Script web app's token-gated doGet roster export.
//
//   npm run sync-guests
//
// Re-running on an unchanged sheet must produce ZERO git diff, so this script
// reproduces lib/rsvp/guests.ts byte-for-byte (same header, same object format,
// same getRosterGuests() function, single trailing newline).

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const ENV_PATH = join(PROJECT_ROOT, ".env.local");
const GUESTS_PATH = join(PROJECT_ROOT, "lib", "rsvp", "guests.ts");

const RELATIONSHIPS = new Set(["primary", "spouse", "plus-one", "child"]);
const SIDES = new Set(["bride", "groom", "both"]);

/** Parse .env.local: split on first "=", ignore blank/# lines, strip quotes. */
async function parseEnvLocal() {
  let raw;
  try {
    raw = await readFile(ENV_PATH, "utf8");
  } catch {
    throw new Error(`Could not read ${ENV_PATH}. Create it with RSVP_APPS_SCRIPT_URL and RSVP_APPS_SCRIPT_TOKEN.`);
  }
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function buildGuestsFile(roster) {
  const header =
    'import "server-only";\n' +
    'import type { GuestRow } from "./schema";\n' +
    "\n" +
    '// AUTO-GENERATED from the "Guests" Google Sheet. Do not edit by hand.\n' +
    "// Re-sync after editing the sheet with:  npm run sync-guests\n" +
    "//\n" +
    "// IMPORTANT: order MUST match the sheet's row order. rowIndex is derived from\n" +
    "// position below (the sheet header is row 1, so the first guest here is row 2),\n" +
    "// and the RSVP writer targets G{rowIndex}:K{rowIndex} in the sheet.\n" +
    'export const GUEST_ROSTER: Omit<GuestRow, "rowIndex">[] = [\n';

  const rows = roster
    .map(
      (g) =>
        "  { partyId: " +
        JSON.stringify(g.partyId) +
        ", partyLabel: " +
        JSON.stringify(g.partyLabel) +
        ", firstName: " +
        JSON.stringify(g.firstName) +
        ", lastName: " +
        JSON.stringify(g.lastName) +
        ", relationship: " +
        JSON.stringify(g.relationship) +
        ", side: " +
        JSON.stringify(g.side) +
        " },\n"
    )
    .join("");

  const footer =
    "];\n" +
    "\n" +
    "export function getRosterGuests(): GuestRow[] {\n" +
    "  return GUEST_ROSTER.map((row, i) => ({ ...row, rowIndex: i + 2 }));\n" +
    "}\n";

  return header + rows + footer;
}

async function main() {
  const env = await parseEnvLocal();
  const url = env.RSVP_APPS_SCRIPT_URL;
  const token = env.RSVP_APPS_SCRIPT_TOKEN;

  if (!url) {
    throw new Error("RSVP_APPS_SCRIPT_URL is blank in .env.local. Set it to the deployed Apps Script /exec URL.");
  }
  if (!token) {
    throw new Error("RSVP_APPS_SCRIPT_TOKEN is blank in .env.local. Set it to the same shared secret as the Apps Script TOKEN.");
  }

  const res = await fetch(url + "?token=" + encodeURIComponent(token));
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Response from Apps Script was not JSON (HTTP ${res.status}). Check the URL and that the web app is deployed.`);
  }

  if (!data || data.ok !== true) {
    throw new Error(`Apps Script returned an error: ${data && data.error ? data.error : "unknown error"}`);
  }
  if (!Array.isArray(data.roster)) {
    throw new Error("Apps Script response did not include a roster array.");
  }

  const roster = data.roster;
  roster.forEach((g, i) => {
    const where = `roster row ${i + 1} (sheet row ${i + 2})`;
    for (const key of ["partyId", "partyLabel", "firstName", "lastName", "relationship"]) {
      if (typeof g[key] !== "string" || g[key].length === 0) {
        throw new Error(`${where}: "${key}" is missing or empty.`);
      }
    }
    if (!RELATIONSHIPS.has(g.relationship)) {
      throw new Error(`${where}: relationship "${g.relationship}" is not one of primary, spouse, plus-one, child.`);
    }
    if (!SIDES.has(g.side)) {
      throw new Error(`${where}: side "${g.side}" is not one of bride, groom, both.`);
    }
  });

  const contents = buildGuestsFile(roster);
  await writeFile(GUESTS_PATH, contents, "utf8");

  const partyCount = new Set(roster.map((g) => g.partyId)).size;
  console.log(`Wrote ${roster.length} guests across ${partyCount} parties to lib/rsvp/guests.ts`);
}

main().catch((err) => {
  console.error("sync-guests failed:", err.message);
  process.exit(1);
});
