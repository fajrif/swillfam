/**
 * Query form of "is this event over?" — the counterpart to `isPastEvent`.
 *
 * Every list that promises upcoming events has to filter the same way, or the
 * site contradicts itself: the calendar would draw a night the Upcoming grid
 * has dropped. Both helpers below are built from one set of clauses so there is
 * a single statement of the rule, and `isPastEvent` in `event-calendar.ts` is
 * its in-memory twin for rows a page has already fetched.
 *
 * **Both fragments own `AND`.** `publishedVenueScope` is an `OR`, the date test
 * is an `OR`, and callers like the related-events query add a third at the top
 * level — so they are nested under `AND` rather than spread, where the last one
 * written would silently replace the others.
 */

import type { Prisma } from "@/generated/prisma/client";
import { startOfUtcDay } from "./date";
import { publishedVenueScope } from "./venue-scope";

/**
 * Matches an event whose last day is still ahead, plus every recurring night.
 *
 * A recurring event has no end date, so it can only be retired by hand; a
 * one-off is current through the whole of its final day.
 */
function notPastYet(now: Date): Prisma.EventWhereInput {
  const today = startOfUtcDay(now);
  return {
    OR: [
      { eventType: "RECURRING" },
      { endDate: { gte: today } },
      // A single-day event stores no endDate.
      { endDate: null, startDate: { gte: today } },
    ],
  };
}

/** Events to show wherever the page says "upcoming", "next", or "current". */
export function upcomingEventWhere(now: Date): Prisma.EventWhereInput {
  return { active: true, AND: [publishedVenueScope, notPastYet(now)] };
}

/**
 * Events that are over — retired by hand, or past their last day.
 *
 * Used by "Past Editions", the one list that wants exactly these. It is the
 * complement of `upcomingEventWhere` within the same venue scope: not
 * (`active` and not past) is (not `active`) or past.
 */
export function pastEventWhere(now: Date): Prisma.EventWhereInput {
  return {
    AND: [publishedVenueScope, { OR: [{ active: false }, { NOT: notPastYet(now) }] }],
  };
}
