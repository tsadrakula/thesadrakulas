"use server";

import { writeRsvp } from "@/lib/rsvp/sheet";
import { getRosterGuests } from "@/lib/rsvp/guests";
import { matchParties } from "@/lib/rsvp/match";
import { RsvpPayload, type Party } from "@/lib/rsvp/schema";

const ALREADY_RESPONDED =
  "This party has already responded. Please contact the couple to make a change.";

function writeEnabled(): boolean {
  return Boolean(process.env.RSVP_APPS_SCRIPT_URL && process.env.RSVP_APPS_SCRIPT_TOKEN);
}

// Which parties have already responded. This comes live from the Apps Script —
// the mirror in lib/rsvp/guests.ts is static and carries no submission state —
// so we cache it briefly to avoid calling the script on every keystroke.
const STATUS_TTL_MS = 30_000;
let statusCache: { ids: Set<string>; expires: number } | null = null;

async function fetchSubmittedPartyIds(force = false): Promise<Set<string>> {
  if (!writeEnabled()) return new Set();
  if (!force && statusCache && statusCache.expires > Date.now()) {
    return statusCache.ids;
  }
  try {
    const url = process.env.RSVP_APPS_SCRIPT_URL as string;
    const token = process.env.RSVP_APPS_SCRIPT_TOKEN as string;
    const res = await fetch(
      `${url}?token=${encodeURIComponent(token)}&action=status`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`status HTTP ${res.status}`);
    const data = (await res.json()) as {
      ok?: boolean;
      submittedPartyIds?: string[];
    };
    if (!data?.ok || !Array.isArray(data.submittedPartyIds)) {
      throw new Error("unexpected status response");
    }
    const ids = new Set(data.submittedPartyIds);
    statusCache = { ids, expires: Date.now() + STATUS_TTL_MS };
    return ids;
  } catch (err) {
    // Fail open: never block lookups if status is unavailable. The Apps Script
    // still refuses to overwrite an already-responded row at the data layer.
    console.warn("[rsvp.status] could not load submitted parties:", err);
    return new Set();
  }
}

export async function lookupParties(query: string): Promise<Party[]> {
  if (typeof query !== "string") return [];
  const trimmed = query.trim();
  if (trimmed.length < 2 || trimmed.length > 80) return [];

  const guests = getRosterGuests();
  const parties = matchParties(trimmed, guests);
  const submittedIds = await fetchSubmittedPartyIds();
  return parties.map((p) => ({ ...p, submitted: submittedIds.has(p.partyId) }));
}

export async function submitRsvp(
  input: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = RsvpPayload.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid RSVP payload" };
  }

  try {
    if (writeEnabled()) {
      // Backstop the UI block: refuse a party that has already responded.
      const submittedIds = await fetchSubmittedPartyIds();
      if (submittedIds.has(parsed.data.partyId)) {
        return { ok: false, error: ALREADY_RESPONDED };
      }
      await writeRsvp(parsed.data);
      statusCache = null; // reflect this new response on the next lookup
    } else if (process.env.NODE_ENV === "production") {
      console.error(
        "[rsvp.submit] writes are not configured (missing RSVP_APPS_SCRIPT_URL/RSVP_APPS_SCRIPT_TOKEN)",
      );
      return { ok: false, error: "We couldn't save your reply. Please try again." };
    } else {
      console.warn("[rsvp.submit] writes disabled in dev — RSVP not persisted");
      console.warn("[rsvp.submit] payload:", JSON.stringify(parsed.data));
    }
    return { ok: true };
  } catch (err) {
    console.error("[rsvp.submit]", err);
    // The Apps Script also rejects overwrites at the data layer; surface that
    // case with the friendly message rather than a generic failure.
    if (err instanceof Error && /already responded/i.test(err.message)) {
      return { ok: false, error: ALREADY_RESPONDED };
    }
    return { ok: false, error: "We couldn't save your reply. Please try again." };
  }
}
