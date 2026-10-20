/**
 * Event page: `MusicEvent` / `FoodEvent` / `Event` (+ breadcrumb, + a
 * `VideoObject` once a recap exists).
 */

import type { Event, Talent, Venue } from "@/generated/prisma/client";
import { dateKey, upcomingOccurrences } from "@/lib/event-calendar";
import { ISO_DURATION } from "@/lib/duration";
import { eventSeo } from "@/lib/seo/entities";
import {
  ORG_ID,
  breadcrumb,
  eventId,
  graph,
  imageUrls,
  jakartaDateTime,
  jakartaInstant,
  pageUrl,
  postalAddress,
  ref,
  talentId,
  venueId,
  type JsonLdNode,
} from "./core";

/** How many dates a recurring night advertises. The brief asks for 4–6. */
const RECURRING_OCCURRENCES = 5;

export type EventForSchema = Event & {
  venue?: Venue | null;
  talents?: Pick<Talent, "name" | "slug">[];
};

/**
 * `Place` for the event's venue.
 *
 * The address is embedded rather than referenced by `@id` alone: Google's
 * Event check wants the location's address present on the event page itself,
 * and an `@id` pointing at the venue page does not satisfy it. The `@id` is
 * still carried so the two nodes are understood as the same place.
 */
function eventLocation(venue: Venue): JsonLdNode {
  return {
    "@type": "Place",
    "@id": venueId(venue.slug),
    name: venue.name,
    address: postalAddress(venue),
  };
}

/** `https://schema.org/EventScheduled` — the column already holds the token. */
function statusUrl(status: string): string {
  return `https://schema.org/${status}`;
}

/**
 * `"HH:mm"` as minutes past midnight.
 *
 * Compared numerically, not as strings: seeded rows may hold `"9:00"` rather
 * than `"09:00"`, and `"9:00" < "22:00"` is false lexicographically.
 */
function minutesOf(hhmm: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
}

/**
 * One Event node. `occurrence` is set for recurring nights, which emit one
 * node per upcoming date; fixed events pass nothing and use their own dates.
 */
function eventNode(event: EventForSchema, occurrence?: Date): JsonLdNode {
  const startDay = occurrence ?? event.startDate;
  const endDay = occurrence ?? event.endDate ?? event.startDate;

  // A night whose end hour is before its start hour runs past midnight, so the
  // end lands on the next day — unless a stored `endDate` already says a later
  // day, in which case it is a genuinely multi-day event and stands as is.
  const endOffset =
    dateKey(startDay) === dateKey(endDay) && minutesOf(event.endHour) < minutesOf(event.startHour)
      ? 1
      : 0;

  return {
    "@type": event.schemaEventType,
    // A per-date suffix, so five Fridays are five distinct entities rather
    // than five conflicting copies of one.
    "@id": occurrence ? `${eventId(event.slug)}-${dateKey(startDay)}` : eventId(event.slug),
    name: event.name,
    description: eventSeo(event).description.value,
    url: pageUrl(`/events/${event.slug}`),
    image: imageUrls(event.posterImage, event.bannerImage, event.image),
    startDate: jakartaDateTime(startDay, event.startHour),
    endDate: jakartaDateTime(endDay, event.endHour, endOffset),
    eventStatus: statusUrl(event.eventStatus),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: event.venue ? eventLocation(event.venue) : undefined,
    performer: (event.talents ?? []).map((talent) => ({
      "@type": "Person",
      "@id": talentId(talent.slug),
      name: talent.name,
    })),
    organizer: ref(ORG_ID),
    // Only ticketed events carry an offer. There is no price column — the
    // client decided not to show prices — so a ticket link is all we can
    // honestly claim, and `price` is omitted rather than invented.
    offers: event.ticketLink
      ? {
          "@type": "Offer",
          url: event.ticketLink,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}

/**
 * `VideoObject` for a past event's recap, or undefined when there is none.
 *
 * `duration` is only emitted when it really is an ISO 8601 duration —
 * `toIsoDuration` normalises on save but passes an unparseable value through
 * verbatim so the admin can see and fix it, and that value must not reach the
 * markup.
 *
 * schema.org requires `contentUrl` or `embedUrl`; the admin field is a single
 * URL, so a YouTube/Vimeo link is reported as `embedUrl` and anything else as
 * a direct `contentUrl`.
 */
function recapVideo(event: EventForSchema): JsonLdNode | undefined {
  const url = event.recapVideoUrl?.trim();
  if (!url) return undefined;

  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
  const duration = event.recapDuration?.trim();

  return {
    "@type": "VideoObject",
    name: `${event.name} — Recap`,
    description: eventSeo(event).description.value,
    thumbnailUrl: imageUrls(event.recapThumbnail, event.posterImage, event.image),
    // No separate upload date column — the row's own last change is the
    // closest honest answer, and `uploadDate` is required.
    uploadDate: jakartaInstant(event.updatedAt),
    duration: duration && ISO_DURATION.test(duration) ? duration : undefined,
    embedUrl: isEmbed ? url : undefined,
    contentUrl: isEmbed ? undefined : url,
    about: ref(eventId(event.slug)),
  };
}

export function eventGraph(event: EventForSchema, now = new Date()): Record<string, unknown> {
  const crumbs = breadcrumb({ name: "Events", path: "/events" }, { name: event.name });
  const video = recapVideo(event);

  if (event.eventType === "RECURRING" && event.recurringDays.length > 0) {
    const dates = upcomingOccurrences(event.recurringDays, now, RECURRING_OCCURRENCES);
    return graph(...dates.map((date) => eventNode(event, date)), crumbs, video);
  }

  return graph(eventNode(event), crumbs, video);
}
