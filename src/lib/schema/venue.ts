/**
 * Venue page: `Restaurant` / `BarOrPub` / `CafeOrCoffeeShop` / `NightClub`
 * (+ breadcrumb, + FAQPage when the page shows FAQs).
 */

import type { Venue, VenueHour, Faq, Category } from "@/generated/prisma/client";
import { googleMapsUrl } from "@/lib/maps";
import { WEEKDAY_ORDER } from "@/lib/opening-hours";
import { venueSeo, categorySeo } from "@/lib/seo/entities";
import {
  ORG_ID,
  breadcrumb,
  collectionPage,
  faqPage,
  graph,
  imageUrls,
  pageUrl,
  postalAddress,
  ref,
  venueId,
  type JsonLdNode,
} from "./core";

/**
 * `@type` when a venue has none set.
 *
 * Every launch venue is typed by `seed-venue-schema-types.ts`, but a venue
 * created in the admin starts with an empty list — and a node with no `@type`
 * is invalid, so it falls back to the honest generic rather than guessing
 * between restaurant and club.
 */
const DEFAULT_TYPE = "LocalBusiness";

/**
 * Short forms people actually search for (swillfam-schema-samples.md §4), next
 * to the public `name`. Spelling variants, not data: they don't belong in a
 * column. A venue not listed simply gets none.
 */
const ALTERNATE_NAMES: Record<string, string[]> = {
  "kilo-jakarta": ["Kilo Kitchen", "Kilo Jakarta"],
  "kilo-cafe": ["Kilo Cafe"],
  zoo: ["Zoo"],
  swillhouse: ["Swillhouse"],
};

/** schema.org wants full English day names. */
const DAY_OF_WEEK: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

/**
 * One `OpeningHoursSpecification` per hours row.
 *
 * Built from the same `VenueHour` rows the page's hours text is derived from,
 * so the markup cannot claim hours the visitor isn't shown. A venue with no
 * rows yet emits nothing: the free-text fallback is a display string, not
 * structured data, and parsing it back into days and times would be guessing.
 *
 * Closing after midnight stays on the opening day (`closes: "02:00"`), which
 * is valid and is what the brief specifies.
 */
function openingHours(hours: VenueHour[]): JsonLdNode[] {
  return hours.flatMap((row) => {
    const days = (WEEKDAY_ORDER as readonly string[])
      .filter((day) => (row.days as readonly string[]).includes(day))
      .map((day) => DAY_OF_WEEK[day]);
    if (days.length === 0 || !row.opens.trim() || !row.closes.trim()) return [];
    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days,
        opens: row.opens.trim(),
        closes: row.closes.trim(),
      },
    ];
  });
}

export type VenueForSchema = Venue & {
  hours?: VenueHour[];
  category?: Category | null;
  segmentGalleries?: { images: string[] }[];
};

/**
 * The venue node on its own, so `/venues/{slug}` defines it once and other
 * pages can reference it by `@id`.
 */
export function venueNode(venue: VenueForSchema): JsonLdNode {
  const types = venue.schemaTypes as string[];
  const galleryImages = (venue.segmentGalleries ?? []).flatMap((g) => g.images);

  return {
    // An array only when a venue genuinely is two things — Kilo Jakarta is a
    // restaurant and a bar. A single type stays a plain string.
    "@type": types.length === 0 ? DEFAULT_TYPE : types.length === 1 ? types[0] : types,
    "@id": venueId(venue.slug),
    name: venue.name,
    alternateName: ALTERNATE_NAMES[venue.slug],
    // The same resolution the page's meta description uses — one chain,
    // declared in seo/entities.ts.
    description: venueSeo(venue).description.value,
    url: pageUrl(`/venues/${venue.slug}`),
    image: imageUrls(venue.bannerImage, venue.image, ...galleryImages.slice(0, 4)),
    telephone: venue.whatsapp ?? venue.phone,
    email: venue.email,
    address: postalAddress(venue),
    geo:
      venue.lat != null && venue.lng != null
        ? { "@type": "GeoCoordinates", latitude: venue.lat, longitude: venue.lng }
        : undefined,
    // Same builder as the page's "Open in Google Maps" button.
    hasMap: googleMapsUrl(venue),
    openingHoursSpecification: openingHours(venue.hours ?? []),
    servesCuisine: venue.cuisine,
    acceptsReservations: true,
    sameAs: [venue.instagramUrl],
    parentOrganization: ref(ORG_ID),
  };
}

export function venueGraph(venue: VenueForSchema, faqs: Faq[]): Record<string, unknown> {
  // Venues sit under their category page, which is where the site links from.
  const categoryCrumb = venue.category
    ? [{ name: venue.category.name, path: `/venues/${venue.category.slug}` }]
    : [];

  return graph(
    venueNode(venue),
    breadcrumb(
      { name: "Venues", path: "/venues" },
      ...categoryCrumb,
      { name: venue.name },
    ),
    faqPage(faqs),
  );
}

/**
 * Category page (`/venues/lifestyle`, `/venues/nightlife`) — a CollectionPage
 * listing its venues.
 */
export function categoryGraph({
  category,
  venues,
}: {
  category: Category;
  venues: { name: string; slug: string }[];
}): Record<string, unknown> {
  const path = `/venues/${category.slug}`;
  const seo = categorySeo(category);
  return graph(
    collectionPage({
      path,
      // Same strings the page's own <title>/<meta> resolve to.
      name: seo.title.value,
      description: seo.description.value,
      items: venues.map((venue) => ({ name: venue.name, path: `/venues/${venue.slug}` })),
    }),
    breadcrumb({ name: "Venues", path: "/venues" }, { name: category.name }),
  );
}
