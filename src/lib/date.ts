/**
 * Strip the time component, keeping the UTC calendar day.
 *
 * Admin-typed dates (an event's `startDate`, a promotion's `endDate`) are
 * stored at UTC midnight and mean a calendar day, not an instant — so "has it
 * passed?" is a day comparison, and a row stays current for the whole of its
 * final day. Every date test in `event-calendar.ts`, `event-scope.ts` and
 * `promotion-scope.ts` goes through here, so they can't disagree about where a
 * day ends.
 */
export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Format a Date for an <input type="date"> value. */
export function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

const DAY_MONTH = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });
const DAY_MONTH_YEAR = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** Single human-readable date, e.g. "15 August 2025". */
export function formatDay(date: Date): string {
  return DAY_MONTH_YEAR.format(date);
}

/**
 * Human-readable date range, e.g. "1 July – 31 August 2026". The year is printed
 * once (on the end date) when both dates share a year, otherwise on both.
 */
export function formatDateRange(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear();
  const startPart = sameYear ? DAY_MONTH.format(start) : DAY_MONTH_YEAR.format(start);
  return `${startPart} – ${DAY_MONTH_YEAR.format(end)}`;
}
