"use server";

import { fetchGuests, writeRsvp } from "@/lib/rsvp/sheet";
import { getMockGuests, recordMockSubmit } from "@/lib/rsvp/mock";
import { matchParties } from "@/lib/rsvp/match";
import { RsvpPayload, type Party, type GuestRow } from "@/lib/rsvp/schema";

function useMock() {
  return process.env.RSVP_USE_MOCK === "true" || !process.env.RSVP_SHEET_ID;
}

async function loadGuests(): Promise<GuestRow[]> {
  if (useMock()) return getMockGuests();
  return fetchGuests();
}

export async function lookupParties(query: string): Promise<Party[]> {
  if (typeof query !== "string") return [];
  const trimmed = query.trim();
  if (trimmed.length < 2 || trimmed.length > 80) return [];

  const guests = await loadGuests();
  return matchParties(trimmed, guests);
}

export async function submitRsvp(
  input: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = RsvpPayload.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid RSVP payload" };
  }

  try {
    if (useMock()) {
      parsed.data.answers.forEach((a, i) =>
        recordMockSubmit(
          a.rowIndex,
          a.attending,
          a.meal ?? "",
          a.dietary ?? "",
          i === 0 ? parsed.data.noteToCouple ?? "" : "",
        ),
      );
    } else {
      await writeRsvp(parsed.data);
    }
    return { ok: true };
  } catch (err) {
    console.error("[rsvp.submit]", err);
    return { ok: false, error: "We couldn't save your reply. Please try again." };
  }
}
