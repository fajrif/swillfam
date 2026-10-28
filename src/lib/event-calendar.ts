/**
 * Pure date/recurrence helpers behind the public /events calendar.
 *
 * Timezone contract: event dates are written by the admin from `<input
 * type="date">` via `toDateInputValue` (`toISOString().slice(0, 10)`), i.e. they
 * land in the database as **UTC midnight**. Every calculation here therefore
 * uses UTC getters and UTC-constructed days — using local getters would shift
 * events a day for viewers west of Greenwich.
 */

import { formatDay, formatDateRange, startOfUtcDay } from "@/lib/date";

/** Prisma `Weekday` values indexed by JS UTC day number (0 = Sunday). */
const WEEKDAY_BY_UTC_DAY = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

/** Full weekday labels for `recurringDays`, in display order (Monday first). */
const WEEKDAY_LABEL: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const WEEKDAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

/** Column headers of the month grid — Monday first, matching the design. */
export const WEEKDAY_HEADERS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Which of the three calendar categories an event belongs to. Every event gets
 * exactly one — see `categoryOf` for the precedence — so an event can never be
 * drawn twice on the same day.
 */
export type EventCategoryKind = "regular" | "featured" | "recurring";

/** The subset of `Event` the calendar needs, as passed from the server page. */
export type CalendarEvent = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  eventType: "FIXED" | "RECURRING";
  startDate: Date;
  endDate: Date | null;
  startHour: string;
  endHour: string;
  recurringDays: string[];
  featured: boolean;
  /** Main venue first, then "Also at": the venue filter matches any of them. */
  venueIds: string[];
  venueName: string | null;
  /** Main venue's slug, for the WhatsApp click event; absent where a page doesn't select it. */
  venueSlug?: string | null;
  categoryName: string | null;
  waPhone: string | null;
};

/** One event landing on one specific day of the grid. */
export type EventOccurrence = {
  /** Unique per (event, day) — safe as a React key. */
  key: string;
  event: CalendarEvent;
  /** The day this occurrence falls on (UTC midnight). */
  date: Date;
  category: EventCategoryKind;
};

/** UTC-safe `YYYY-MM-DD` key. */
export function dateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Has this event finished?
 *
 * Two ways it can have: an administrator retired it, or — for a one-off — its
 * last day has gone by. The date half matters because nobody remembers to tick
 * the box: both seeded one-off events were still flagged active months after
 * they ran, which would have left them sitting in "Upcoming" and on the
 * calendar. `RECURRING` nights have no last day and never expire this way; they
 * end only when an administrator says so.
 *
 * Day-granular and UTC, the same contract as the rest of this file: the dates
 * are admin-typed calendar days stored at UTC midnight, so an event stays
 * current for the whole of its final day. `src/lib/event-scope.ts` holds the
 * query form of this rule; keep the two in step.
 */
export function isPastEvent(
  event: {
    eventType: string;
    active: boolean;
    startDate: Date;
    endDate: Date | null;
  },
  now: Date,
): boolean {
  if (!event.active) return true;
  if (event.eventType === "RECURRING") return false;
  return startOfUtcDay(event.endDate ?? event.startDate) < startOfUtcDay(now);
}

/**
 * Assign an event to exactly one calendar category.
 *
 * Precedence is `RECURRING` → `featured` → `regular`: a recurring event is shown
 * as recurring even when it is also flagged featured, so the three legend
 * toggles partition the events instead of overlapping.
 */
export function categoryOf(event: Pick<CalendarEvent, "eventType" | "featured">): EventCategoryKind {
  if (event.eventType === "RECURRING") return "recurring";
  if (event.featured) return "featured";
  return "regular";
}

/**
 * Monday-first grid of UTC days covering `month` (0-indexed), including the
 * leading/trailing spill days needed to complete the first and last weeks.
 * Returns 35 or 42 cells depending on how the month falls.
 */
export function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(Date.UTC(year, month, 1));
  // getUTCDay is Sunday-first (0..6); shift so Monday = 0.
  const lead = (first.getUTCDay() + 6) % 7;
  // Day 0 of the next month is the last day of this one.
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cellCount = Math.ceil((lead + daysInMonth) / 7) * 7;

  // Date.UTC normalises out-of-range day numbers, so negative offsets roll back
  // into the previous month for free.
  return Array.from({ length: cellCount }, (_, i) => new Date(Date.UTC(year, month, 1 - lead + i)));
}

/**
 * Expand events into per-day occurrences across the given grid.
 *
 * - `FIXED` events occupy every day in `[startDate, endDate ?? startDate]`.
 * - `RECURRING` events occupy every day whose weekday is in `recurringDays`.
 *
 * The grid is at most 42 cells, so scanning it per event is cheaper (and far
 * clearer) than range arithmetic.
 */
export function buildOccurrenceMap(
  events: CalendarEvent[],
  grid: Date[],
): Map<string, EventOccurrence[]> {
  const map = new Map<string, EventOccurrence[]>();
  if (grid.length === 0) return map;

  const add = (event: CalendarEvent, day: Date, category: EventCategoryKind) => {
    const key = dateKey(day);
    const list = map.get(key);
    const occurrence: EventOccurrence = { key: `${event.id}-${key}`, event, date: day, category };
    if (list) list.push(occurrence);
    else map.set(key, [occurrence]);
  };

  for (const event of events) {
    const category = categoryOf(event);

    if (event.eventType === "RECURRING") {
      if (event.recurringDays.length === 0) continue;
      const days = new Set(event.recurringDays);
      for (const day of grid) {
        if (days.has(WEEKDAY_BY_UTC_DAY[day.getUTCDay()])) add(event, day, category);
      }
      continue;
    }

    const from = startOfUtcDay(event.startDate).getTime();
    // Guard against an end date that precedes the start (bad data) — such an
    // event still shows on its start day rather than vanishing.
    const to = Math.max(from, startOfUtcDay(event.endDate ?? event.startDate).getTime());
    for (const day of grid) {
      const t = day.getTime();
      if (t >= from && t <= to) add(event, day, category);
    }
  }

  // Earliest start time first, then alphabetical, so day cells read predictably.
  for (const list of map.values()) {
    list.sort((a, b) =>
      a.event.startHour === b.event.startHour
        ? a.event.name.localeCompare(b.event.name)
        : a.event.startHour.localeCompare(b.event.startHour),
    );
  }

  return map;
}

/**
 * Combine a calendar day with an `"HH:mm"` start hour into a single instant.
 * UTC throughout, matching how the dates are stored — an unparseable hour just
 * leaves the day at midnight.
 */
export function occurrenceStart(date: Date, startHour: string): Date {
  const match = /^(\d{1,2}):(\d{2})$/.exec(startHour.trim());
  const hours = match ? Number(match[1]) : 0;
  const minutes = match ? Number(match[2]) : 0;
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hours, minutes),
  );
}

/**
 * The next UTC day on or after `from` whose weekday is in `recurringDays`, or
 * `null` when the list is empty. Scans at most 7 days, so a match is guaranteed
 * whenever at least one weekday is set.
 */
export function nextOccurrence(recurringDays: string[], from: Date): Date | null {
  if (recurringDays.length === 0) return null;
  const days = new Set(recurringDays);
  const start = startOfUtcDay(from);
  for (let i = 0; i < 7; i++) {
    const day = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + i),
    );
    if (days.has(WEEKDAY_BY_UTC_DAY[day.getUTCDay()])) return day;
  }
  return null;
}

/**
 * The next `count` UTC days matching `recurringDays`, on or after `from`.
 *
 * A recurring event has no single date, and a schema.org `Event` without a
 * concrete `startDate` is invalid — so the JSON-LD builder emits one Event per
 * upcoming occurrence instead. Built on `nextOccurrence` so the dates the
 * markup advertises are the same ones the calendar draws.
 */
export function upcomingOccurrences(
  recurringDays: string[],
  from: Date,
  count: number,
): Date[] {
  const dates: Date[] = [];
  let cursor = from;

  for (let i = 0; i < count; i++) {
    const next = nextOccurrence(recurringDays, cursor);
    if (!next) break;
    dates.push(next);
    // Resume the day after, or `nextOccurrence` would return the same day.
    cursor = new Date(
      Date.UTC(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate() + 1),
    );
  }

  return dates;
}

/** `"20:00"` → `"8:00 PM"`. Returns the input unchanged if it isn't `HH:mm`. */
export function formatHour(hhmm: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!match) return hhmm;
  const hours = Number(match[1]);
  if (hours > 23) return hhmm;
  const suffix = hours >= 12 ? "PM" : "AM";
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${match[2]} ${suffix}`;
}

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** `"June 20, 2026"` — UTC-pinned to match how the dates are stored. */
export function formatLongDate(date: Date): string {
  return LONG_DATE.format(date);
}

/** `"June 20, 2026 – 8:00 PM"`, the modal's Date & Time line. */
export function formatOccurrenceDateTime(date: Date, startHour: string): string {
  return `${formatLongDate(date)} – ${formatHour(startHour)}`;
}

/**
 * The days a one-off event runs, UTC-pinned like the rest of this file:
 * `"October 30, 2026"` for one day, `"October 30 – 31, 2026"` within a month,
 * `"October 30 – November 2, 2026"` across months, and both years across years.
 */
export function formatEventDays(start: Date, end: Date | null): string {
  if (!end || dateKey(end) === dateKey(start)) return formatLongDate(start);
  const sy = start.getUTCFullYear();
  const ey = end.getUTCFullYear();
  if (sy !== ey) return `${formatLongDate(start)} – ${formatLongDate(end)}`;
  const month = (d: Date) => MONTH_NAMES[d.getUTCMonth()];
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${month(start)} ${start.getUTCDate()} – ${end.getUTCDate()}, ${ey}`;
  }
  return `${month(start)} ${start.getUTCDate()} – ${month(end)} ${end.getUTCDate()}, ${ey}`;
}

/** `"9:00 PM – 4:00 AM"`; an end earlier than the start simply means the next morning. */
export function formatHourRange(startHour: string, endHour: string): string {
  return `${formatHour(startHour)} – ${formatHour(endHour)}`;
}

/** `"June 2026"`, the month-navigation label. */
export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/**
 * One day → `"Every Friday"`; several → their first three letters in week order,
 * `"Every Mon, Tue, Fri"`; all seven → `"Every day"`; none → `"Recurring"`.
 *
 * A single day is spelled out because there is room and it reads better; the
 * short names are what keep a longer list inside a card. `long` spells every
 * name out for the detail pages, which have the width.
 */
export function formatRecurringDays(days: string[], { long = false } = {}): string {
  const picked = WEEKDAY_ORDER.filter((d) => days.includes(d));
  if (picked.length === 0) return "Recurring";
  if (picked.length === WEEKDAY_ORDER.length) return "Every day";

  const spelledOut = long || picked.length === 1;
  const names = picked.map((d) => (spelledOut ? WEEKDAY_LABEL[d] : WEEKDAY_LABEL[d].slice(0, 3)));
  return `Every ${names.join(", ")}`;
}

/**
 * Recurring events have no single date — label them by weekday. Fixed events
 * show a range only when they actually span more than one day.
 */
export function formatEventSchedule(event: {
  eventType: "FIXED" | "RECURRING";
  startDate: Date;
  endDate: Date | null;
  recurringDays: string[];
}): string {
  if (event.eventType === "RECURRING") return formatRecurringDays(event.recurringDays);
  if (!event.endDate || dateKey(event.endDate) === dateKey(event.startDate)) return formatDay(event.startDate);
  return formatDateRange(event.startDate, event.endDate);
}
