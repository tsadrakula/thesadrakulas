import "server-only";
import type { RsvpPayload } from "./schema";

// RSVP writes go to the "Guests" Google Sheet through a deployed Google Apps
// Script web app. The Apps Script performs the actual column mapping and the
// partyId safety guard. See docs/rsvp-apps-script-setup.md for the Apps Script
// source, deployment steps, and the env vars it expects.
//
// Reads (name lookup) do NOT come through here — they read the committed mirror
// in lib/rsvp/guests.ts.

export async function writeRsvp(payload: RsvpPayload): Promise<void> {
  const url = process.env.RSVP_APPS_SCRIPT_URL;
  const token = process.env.RSVP_APPS_SCRIPT_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing RSVP_APPS_SCRIPT_URL or RSVP_APPS_SCRIPT_TOKEN. See docs/rsvp-apps-script-setup.md.",
    );
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, payload }),
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Apps Script request failed: HTTP ${res.status} ${res.statusText}`);
  }

  const result = (await res.json()) as { ok?: boolean; error?: string };
  if (result.ok !== true) {
    throw new Error(`Apps Script rejected the write: ${result.error ?? "unknown error"}`);
  }
}
