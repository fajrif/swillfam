/**
 * Opening hours: the day vocabulary, and the one formatter that turns
 * structured `VenueHour` rows into the string the public page shows.
 *
 * The point of deriving the display string instead of storing it twice is that
 * the venue page and the `OpeningHoursSpecification` markup then read from the
 * same rows, so they cannot drift — which is exactly what went wrong on the old
 * site, where the free-text hours and the schema disagreed.
 *
 * No Prisma import, so the admin's hours editor (a client component) can show a
 * live preview of what the public page will say. `Weekday[]` from the generated
 * client is assignable to `readonly string[]` here with no cast.
 */

/** Monday-first, matching the `Weekday` enum's declaration order. */
export const WEEKDAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type WeekdayToken = (typeof WEEKDAY_ORDER)[number];

const DAY_NAME: Record<WeekdayToken, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

/** For the editor's day pills. */
export const WEEKDAY_OPTIONS = WEEKDAY_ORDER.map((value) => ({
  value,
  label: DAY_NAME[value].slice(0, 3),
}));

export type OpeningHoursRow = {
  days: readonly string[];
  opens: string;
  closes: string;
};

/** Sorted day indices, unknown tokens dropped. */
function dayIndices(days: readonly string[]): number[] {
  const seen = new Set<number>();
  for (const day of days) {
    const index = (WEEKDAY_ORDER as readonly string[]).indexOf(day);
    if (index >= 0) seen.add(index);
  }
  return [...seen].sort((a, b) => a - b);
}

/**
 * "Monday - Wednesday, Friday" — consecutive days collapse into a range.
 *
 * A run of two is left as two names: "Friday, Saturday" reads better than
 * "Friday - Saturday", and is how the venues already phrase their weekends.
 */
function formatDays(days: readonly string[]): string {
  const indices = dayIndices(days);
  if (indices.length === 0) return "";

  const runs: number[][] = [];
  for (const index of indices) {
    const last = runs.at(-1);
    if (last && index === last.at(-1)! + 1) last.push(index);
    else runs.push([index]);
  }

  return runs
    .map((run) =>
      run.length >= 3
        ? `${DAY_NAME[WEEKDAY_ORDER[run[0]]]} - ${DAY_NAME[WEEKDAY_ORDER[run.at(-1)!]]}`
        : run.map((i) => DAY_NAME[WEEKDAY_ORDER[i]]).join(", "),
    )
    .join(", ");
}

/**
 * The public display string for a set of hours rows, one line per row.
 *
 * Deliberately matches the format of the free-text `operatingHours` presets
 * ("Monday - Sunday: 12:00 - 03:00") so a venue's page looks identical whether
 * its hours are structured yet or not. Rows missing days or times are skipped —
 * a half-filled row would otherwise render as ": 18:00 - ".
 *
 * Returns "" when there is nothing to show, which is what makes
 * `venueHoursText` able to fall back.
 */
export function formatOpeningHours(rows: readonly OpeningHoursRow[]): string {
  return rows
    .map((row) => {
      const days = formatDays(row.days);
      const opens = row.opens.trim();
      const closes = row.closes.trim();
      return days && opens && closes ? `${days}: ${opens} - ${closes}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Hours for display: structured rows when the venue has them, otherwise the
 * free-text field. Every public surface that shows hours goes through here.
 */
export function venueHoursText(
  rows: readonly OpeningHoursRow[] | undefined,
  fallback: string,
): string {
  return (rows && formatOpeningHours(rows)) || fallback;
}

/**
 * Reads the JSON the hours editor posts in its single hidden field.
 *
 * Lives here next to the formatter because this is the other half of the same
 * wire contract — `OpeningHoursFields` serialises, this parses, and TypeScript
 * cannot connect them across `JSON.stringify`, so keeping them in one file is
 * what makes a mismatch visible.
 *
 * Half-filled rows are dropped rather than stored: a row with no days or no
 * times renders as nothing and would be an invalid `OpeningHoursSpecification`,
 * so there is no state in which keeping it helps. Malformed input yields an
 * empty list, which falls the venue back to its free-text hours instead of
 * throwing in the middle of a save.
 */
export function parseHoursJson(raw: string): { days: WeekdayToken[]; opens: string; closes: string }[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const valid = new Set<string>(WEEKDAY_ORDER);

  return parsed.flatMap((row) => {
    if (typeof row !== "object" || row === null) return [];
    const { days, opens, closes } = row as Record<string, unknown>;
    const cleanDays = (Array.isArray(days) ? days : []).filter(
      (d): d is WeekdayToken => typeof d === "string" && valid.has(d),
    );
    const cleanOpens = typeof opens === "string" ? opens.trim() : "";
    const cleanCloses = typeof closes === "string" ? closes.trim() : "";
    if (cleanDays.length === 0 || !cleanOpens || !cleanCloses) return [];
    return [{ days: cleanDays, opens: cleanOpens, closes: cleanCloses }];
  });
}
