import type { GuestRow, Party } from "./schema";

const TOKEN_RE = /[a-z0-9']+/g;

function tokens(s: string): string[] {
  return s.toLowerCase().match(TOKEN_RE) ?? [];
}

function score(rowText: string, queryTokens: string[]): number {
  const text = rowText.toLowerCase();
  let s = 0;
  for (const q of queryTokens) {
    if (q.length < 2) continue;
    if (text === q) s += 100;
    else if (text.split(/\s+/).some((t) => t === q)) s += 80;
    else if (text.startsWith(q)) s += 60;
    else if (text.includes(q)) s += 30;
  }
  return s;
}

export function matchParties(query: string, rows: GuestRow[], limit = 5): Party[] {
  const qTokens = tokens(query);
  if (qTokens.length === 0 || query.trim().length < 2) return [];

  const scored = new Map<string, { score: number; label: string; members: GuestRow[] }>();

  for (const row of rows) {
    const fullName = `${row.firstName} ${row.lastName}`;
    const memberScore = Math.max(
      score(fullName, qTokens),
      score(row.firstName, qTokens),
      score(row.lastName, qTokens),
      score(row.partyLabel, qTokens) * 0.6,
    );

    const existing = scored.get(row.partyId);
    if (existing) {
      existing.score = Math.max(existing.score, memberScore);
      existing.members.push(row);
    } else {
      scored.set(row.partyId, {
        score: memberScore,
        label: row.partyLabel,
        members: [row],
      });
    }
  }

  return Array.from(scored.entries())
    .filter(([, v]) => v.score > 0)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, limit)
    .map(([partyId, v]) => ({
      partyId,
      partyLabel: v.label,
      members: v.members.sort((a, b) => a.rowIndex - b.rowIndex),
    }));
}
