import "server-only";
import type { GuestRow } from "./schema";

const MOCK: Omit<GuestRow, "rowIndex">[] = [
  { partyId: "P-001", partyLabel: "The Hayes Family", firstName: "Eleanor", lastName: "Hayes", relationship: "primary", side: "bride" },
  { partyId: "P-001", partyLabel: "The Hayes Family", firstName: "James", lastName: "Hayes", relationship: "spouse", side: "bride" },
  { partyId: "P-002", partyLabel: "Margaret Whitfield", firstName: "Margaret", lastName: "Whitfield", relationship: "primary", side: "bride" },
  { partyId: "P-003", partyLabel: "The Bennetts", firstName: "Charles", lastName: "Bennett", relationship: "primary", side: "groom" },
  { partyId: "P-003", partyLabel: "The Bennetts", firstName: "Diana", lastName: "Bennett", relationship: "spouse", side: "groom" },
  { partyId: "P-004", partyLabel: "Oliver Reyes", firstName: "Oliver", lastName: "Reyes", relationship: "primary", side: "groom" },
  { partyId: "P-004", partyLabel: "Oliver Reyes", firstName: "Guest of", lastName: "Reyes", relationship: "plus-one", side: "groom" },
  { partyId: "P-005", partyLabel: "The Lockwoods", firstName: "Henry", lastName: "Lockwood", relationship: "primary", side: "bride" },
  { partyId: "P-005", partyLabel: "The Lockwoods", firstName: "Vivian", lastName: "Lockwood", relationship: "spouse", side: "bride" },
  { partyId: "P-006", partyLabel: "Sophia Marchetti", firstName: "Sophia", lastName: "Marchetti", relationship: "primary", side: "groom" },
  { partyId: "P-007", partyLabel: "The Sadrakulas", firstName: "Trenton", lastName: "Sadrakula", relationship: "primary", side: "groom" },
  { partyId: "P-007", partyLabel: "The Sadrakulas", firstName: "Sydney", lastName: "Krause", relationship: "spouse", side: "bride" },
];

export function getMockGuests(): GuestRow[] {
  return MOCK.map((row, i) => ({ ...row, rowIndex: i + 2 }));
}

const mockState = new Map<string, { attending: string; meal: string; dietary: string; noteToCouple: string; submittedAt: string }>();

export function recordMockSubmit(
  rowIndex: number,
  attending: string,
  meal: string,
  dietary: string,
  noteToCouple: string,
): void {
  mockState.set(String(rowIndex), {
    attending,
    meal,
    dietary,
    noteToCouple,
    submittedAt: new Date().toISOString(),
  });
}
