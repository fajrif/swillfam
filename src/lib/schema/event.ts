/**
 * Event page: `MusicEvent` / `FoodEvent` / `Event` (+ breadcrumb, + a
 * `VideoObject` once a recap exists).
 */

import type { Event, Talent, Venue } from "@/generated/prisma/client";
import { dateKey, upcomingOccurrences } from "@/lib/event-calendar";
import { ISO_DURATION } from "@/lib/duration";
import { parseVideoUrl } from "@/lib/video";
import { eventSeo } from "@/lib/seo/entities";
import {
  ORG_ID,
  breadcrumb,
  eventId,
  graph,
  imageUrl,
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
  /** Published "Also at" venues; the main `venue` is listed first in `location`. */
  extraVenues?: Venue[];
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

/**
 * The main venue, then each "Also at" venue. One place stays an object (what
 * the Event check expects for a single venue); several become an array.
 */
function eventLocations(event: EventForSchema): JsonLdNode | JsonLdNode[] | undefined {
  const venues = [event.venue, ...(event.extraVenues ?? [])].filter((v): v is Venue => !!v);
  if (venues.length === 0) return undefined;
  const places = venues.map(eventLocation);
  return places.length === 1 ? places[0] : places;
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
    location: eventLocations(event),
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
 * `VideoObject` for an event's recap, or undefined when there is none.
 *
 * Emitted on exactly the condition `EventRecapSection` renders: `parseVideoUrl`
 * decides both, so this can't end up describing a video the page doesn't play.
 * That is the same rule the FAQ accordion had to be fixed for — markup for
 * content a visitor can't see is markup Google's guidelines disallow.
 *
 * `embedUrl` is the **player** URL `parseVideoUrl` derives, not the watch page
 * the admin pasted: the spec's sample asks for `{youtube_embed_url}`, and a
 * `/watch?v=` link is not a player. `contentUrl` is used for a file we serve
 * ourselves; schema.org requires one of the two.
 *
 * `duration` is only emitted when it really is an ISO 8601 duration —
 * `toIsoDuration` normalises on save but passes an unparseable value through
 * verbatim so the admin can see and fix it, and that value must not reach the
 * markup. `formatIsoDuration` drops the on-page label on the same condition.
 */
function recapVideo(event: EventForSchema): JsonLdNode | undefined {
  const source = parseVideoUrl(event.recapVideoUrl);
  if (!source) return undefined;

  const duration = event.recapDuration?.trim();

  return {
    "@type": "VideoObject",
    name: `${event.name} — Recap`,
    description: eventSeo(event).description.value,
    // One image, in the page's own fallback order: `thumbnailUrl` may be a list
    // only when the entries are the same still at different sizes, and these
    // are three different pictures.
    thumbnailUrl: imageUrl(event.recapThumbnail ?? event.posterImage ?? event.image),
    // No separate upload date column — the row's own last change is the
    // closest honest answer, and `uploadDate` is required.
    uploadDate: jakartaInstant(event.updatedAt),
    duration: duration && ISO_DURATION.test(duration) ? duration : undefined,
    embedUrl: source.kind === "embed" ? source.embedUrl : undefined,
    contentUrl: source.kind === "file" ? source.contentUrl : undefined,
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
