import "server-only";
import { cache } from "react";
import { sheets, type sheets_v4 } from "@googleapis/sheets";
import { JWT } from "google-auth-library";
import { GuestRow, type RsvpPayload, type Relationship } from "./schema";

const SHEET_TAB = "Guests";
const SHEET_RANGE = `${SHEET_TAB}!A2:K`;
const HEADER_RANGE = `${SHEET_TAB}!A1:K1`;

let cachedClient: sheets_v4.Sheets | null = null;

function readEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function getClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;

  const raw = readEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
  const creds = JSON.parse(raw) as {
    client_email: string;
    private_key: string;
  };

  const auth = new JWT({
    email: creds.client_email,
    key: creds.private_key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedClient = sheets({ version: "v4", auth });
  return cachedClient;
}

function parseRow(rowIndex: number, row: string[]): GuestRow | null {
  const [
    partyId,
    partyLabel,
    firstName,
    lastName,
    relationship,
    side,
    attending,
    meal,
    dietary,
    noteToCouple,
    submittedAt,
  ] = row;

  if (!partyId || !partyLabel || !firstName || !lastName || !relationship) return null;

  const result = GuestRow.safeParse({
    partyId,
    partyLabel,
    firstName,
    lastName,
    relationship: relationship as Relationship,
    side: side || undefined,
    attending: attending || null,
    meal: meal || null,
    dietary: dietary || null,
    noteToCouple: noteToCouple || null,
    submittedAt: submittedAt || null,
    rowIndex,
  });

  return result.success ? result.data : null;
}

export const fetchGuests = cache(async (): Promise<GuestRow[]> => {
  const api = getClient();
  const sheetId = readEnv("RSVP_SHEET_ID");

  const res = await api.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: SHEET_RANGE,
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const rows = res.data.values ?? [];
  const guests: GuestRow[] = [];
  rows.forEach((row, i) => {
    const parsed = parseRow(i + 2, row.map((v) => (v == null ? "" : String(v))));
    if (parsed) guests.push(parsed);
  });
  return guests;
});

export async function ensureHeaderRow(): Promise<void> {
  const api = getClient();
  const sheetId = readEnv("RSVP_SHEET_ID");
  const expected = [
    "partyId",
    "partyLabel",
    "firstName",
    "lastName",
    "relationship",
    "side",
    "attending",
    "meal",
    "dietary",
    "noteToCouple",
    "submittedAt",
  ];
  const res = await api.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: HEADER_RANGE,
  });
  const current = (res.data.values?.[0] ?? []) as string[];
  if (current.join("|") === expected.join("|")) return;

  await api.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: HEADER_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: [expected] },
  });
}

export async function writeRsvp(payload: RsvpPayload): Promise<void> {
  const api = getClient();
  const sheetId = readEnv("RSVP_SHEET_ID");
  const submittedAt = new Date().toISOString();

  const data = payload.answers.map((a, i) => ({
    range: `${SHEET_TAB}!G${a.rowIndex}:K${a.rowIndex}`,
    values: [
      [
        a.attending,
        a.meal ?? "",
        a.dietary ?? "",
        i === 0 ? payload.noteToCouple ?? "" : "",
        submittedAt,
      ],
    ],
  }));

  await api.spreadsheets.values.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: { valueInputOption: "RAW", data },
  });
}
