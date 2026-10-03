export type SearchableCommand = { label: string; group?: string; hint?: string; keywords?: string[] };

function score(text: string, q: string) {
  const t = text.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.split(/[\s\-_/]+/).some((w) => w.startsWith(q))) return 60;
  if (t.includes(q)) return 40;
  // Subsequence match: every query character appears in order.
  let i = 0;
  for (const ch of t) if (ch === q[i]) i++;
  return i === q.length ? 10 : 0;
}

/** Rank commands by label, then keywords, hint and group. Empty query returns items as-is. */
export function searchCommands<T extends SearchableCommand>(items: readonly T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...items];
  return items
    .map((item, index) => {
      const best = Math.max(
        score(item.label, q),
        ...(item.keywords ?? []).map((k) => score(k, q) * 0.9),
        item.hint ? score(item.hint, q) * 0.6 : 0,
        item.group ? score(item.group, q) * 0.5 : 0,
      );
      return { item, index, best };
    })
    .filter((r) => r.best > 0)
    .sort((a, b) => b.best - a.best || a.index - b.index)
    .map((r) => r.item);
}
