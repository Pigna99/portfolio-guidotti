import type { Lang } from "./i18n";

const MONTHS_IT = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface YearMonth {
  year: number;
  month: number; // 0-indexed
}

function parse(s: string | undefined): YearMonth | null {
  if (!s) return null;
  const [yStr, mStr] = s.split("-");
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr ?? "1", 10) - 1;
  if (Number.isNaN(year)) return null;
  return { year, month: Number.isNaN(month) ? 0 : Math.max(0, Math.min(11, month)) };
}

/**
 * Format a date range using only month names + year. If start and end fall in
 * the same month, only one is shown. Years are collapsed when equal.
 *
 * Examples (lang = it):
 *   start "2026-01" / end "2026-03"        → "Gen — Mar 2026"
 *   start "2026-01" / end "2026-01"        → "Gen 2026"
 *   start "2025-11" / end "2026-02"        → "Nov 2025 — Feb 2026"
 *   start "2026-01" / end undefined        → "Gen 2026"
 */
export function formatDateRange(
  start: string | undefined,
  end: string | undefined,
  lang: Lang
): string {
  const months = lang === "en" ? MONTHS_EN : MONTHS_IT;
  const s = parse(start);
  const e = parse(end);

  if (!s) return "";
  if (!e) return `${months[s.month]} ${s.year}`;

  if (s.year === e.year && s.month === e.month) {
    return `${months[s.month]} ${s.year}`;
  }
  if (s.year === e.year) {
    return `${months[s.month]} — ${months[e.month]} ${s.year}`;
  }
  return `${months[s.month]} ${s.year} — ${months[e.month]} ${e.year}`;
}
