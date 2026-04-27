import type { Lang } from "./i18n";

const MONTHS_IT = [
  "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
  "Lug", "Ago", "Set", "Ott", "Nov", "Dic",
];

const MONTHS_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface ParsedDate {
  year: number;
  /** 0-indexed month, or null if only year was provided. */
  month: number | null;
}

function parse(s: string | undefined): ParsedDate | null {
  if (!s) return null;
  const parts = s.split("-");
  const year = parseInt(parts[0], 10);
  if (Number.isNaN(year)) return null;
  if (parts.length < 2) return { year, month: null };
  const m = parseInt(parts[1], 10);
  if (Number.isNaN(m)) return { year, month: null };
  return { year, month: Math.max(0, Math.min(11, m - 1)) };
}

/**
 * Format a date range using only month names + year. Year-only dates
 * (e.g. "2026") render as the bare year.
 *
 * Examples (lang = it):
 *   "2026-01" / "2026-03"  → "Gen — Mar 2026"
 *   "2026-01" / "2026-01"  → "Gen 2026"
 *   "2025-11" / "2026-02"  → "Nov 2025 — Feb 2026"
 *   "2026-01" /  undefined → "Gen 2026"
 *   "2026"    /  undefined → "2026"
 *   "2026"    / "2026"     → "2026"
 *   "2025"    / "2026"     → "2025 — 2026"
 */
export function formatDateRange(
  start: string | undefined,
  end: string | undefined,
  lang: Lang
): string {
  const months = lang === "en" ? MONTHS_EN : MONTHS_IT;
  const s = parse(start);
  const e = parse(end);

  const fmt = (d: ParsedDate) =>
    d.month === null ? `${d.year}` : `${months[d.month]} ${d.year}`;

  if (!s) return "";
  if (!e) return fmt(s);

  // Same year: collapse year
  if (s.year === e.year) {
    if (s.month === null && e.month === null) return `${s.year}`;
    if (s.month !== null && e.month !== null && s.month === e.month) {
      return `${months[s.month]} ${s.year}`;
    }
    if (s.month !== null && e.month !== null) {
      return `${months[s.month]} — ${months[e.month]} ${s.year}`;
    }
    // Mixed (one has month, other doesn't): just show start fully
    return fmt(s);
  }

  return `${fmt(s)} — ${fmt(e)}`;
}
