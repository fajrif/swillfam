/**
 * The singleton pages: experience, private events, about, contact,
 * merchandise, exclusive, media mentions, and the breadcrumb-only pages.
 */

import type { Faq, Merchandise, PrivateEvent } from "@/generated/prisma/client";
import {
  ORG_ID,
  breadcrumb,
  collectionPage,
  faqPage,
  graph,
  imageUrls,
  pageId,
  pageUrl,
  ref,
  type Crumb,
  type JsonLdNode,
} from "./core";

const JAKARTA = { "@type": "City", name: "Jakarta" };

/**
 * Breadcrumbs only.
 *
 * Promotions get this and nothing more: there is no schema.org type that
 * earns a rich result for a venue offer, and `Offer` without a price (the
 * client decided not to show prices) would say nothing a crawler can use.
 */
export function breadcrumbOnlyGraph(...crumbs: Crumb[]): Record<string, unknown> {
  return graph(breadcrumb(...crumbs));
}

/**
 * `/experience` — `TouristTrip`.
 *
 * **No `itinerary`.** The spec sketches one (café → restaurant → bar → club)
 * and says to build the steps "from the same data that renders the page" — but
 * the page renders prose and a static route image, and never names those
 * venues as steps. Marking up an itinerary a visitor cannot find on the page
 * is precisely what the brief forbids, so the steps wait until the page
 * actually lists them. Logged in ROADMAP_PLAN.md.
 */
export function experienceGraph({
  name,
  description,
}: {
  name: string;
  description?: string | null;
}): Record<string, unknown> {
  return graph(
    {
      "@type": "TouristTrip",
      "@id": pageId("/experience"),
      name,
      description,
      url: pageUrl("/experience"),
      touristType: ["Locals", "Visitors to Jakarta"],
      provider: ref(ORG_ID),
    },
    breadcrumb({ name: "The SwillFam Experience" }),
  );
}

/** `/private-events` and its sub-pages — `Service` + FAQPage + breadcrumb. */
export function privateEventGraph({
  privateEvent,
  faqs,
  name,
  description,
  path,
}: {
  /** Omitted on the archive page, which describes the service generally. */
  privateEvent?: PrivateEvent;
  faqs: Faq[];
  name: string;
  description?: string | null;
  path: string;
}): Record<string, unknown> {
  const service: JsonLdNode = {
    "@type": "Service",
    "@id": pageId(path),
    name,
    serviceType: privateEvent ? `${privateEvent.title} venue hire` : "Private event venue hire",
    description,
    url: pageUrl(path),
    provider: ref(ORG_ID),
    areaServed: JAKARTA,
  };

  const crumbs: Crumb[] = privateEvent
    ? [{ name: "Private Events", path: "/private-events" }, { name: privateEvent.title }]
    : [{ name: "Private Events" }];

  return graph(service, faqPage(faqs), breadcrumb(...crumbs));
}

/** `/about` — `AboutPage`. */
export function aboutGraph({
  name,
  description,
}: {
  name: string;
  description?: string | null;
}): Record<string, unknown> {
  return graph(
    {
      "@type": "AboutPage",
      "@id": pageId("/about"),
      url: pageUrl("/about"),
      name,
      description,
      about: ref(ORG_ID),
    },
    breadcrumb({ name: "About" }),
  );
}

/** `/contact` — `ContactPage`. */
export function contactGraph({
  name,
  description,
}: {
  name: string;
  description?: string | null;
}): Record<string, unknown> {
  return graph(
    {
      "@type": "ContactPage",
      "@id": pageId("/contact"),
      url: pageUrl("/contact"),
      name,
      description,
      about: ref(ORG_ID),
    },
    breadcrumb({ name: "Contact" }),
  );
}

/**
 * `/merchandise` — one `Product` per item, plus the collection page.
 *
 * Product is only valid here because the grid shows a price; `offers` is
 * required and the spec is explicit that a priceless Product is not an option.
 * `price` is the raw decimal string — schema.org wants a number, not the
 * formatted "Rp 250.000" the page displays.
 */
export function merchandiseGraph({
  items,
  name,
  description,
}: {
  items: Merchandise[];
  name: string;
  description?: string | null;
}): Record<string, unknown> {
  return graph(
    collectionPage({
      path: "/merchandise",
      name,
      description,
      // Merchandise has no detail pages — every item links to the one grid.
      items: items.map((item) => ({ name: item.name, path: "/merchandise" })),
    }),
    ...items.map(
      (item): JsonLdNode => ({
        "@type": "Product",
        name: item.name,
        image: imageUrls(item.image),
        description: item.shortDescription,
        brand: { "@type": "Brand", name: "SwillFam" },
        offers: {
          "@type": "Offer",
          price: item.price.toString(),
          priceCurrency: "IDR",
          availability: "https://schema.org/InStock",
          url: pageUrl("/merchandise"),
        },
      }),
    ),
    breadcrumb({ name: "Merchandise" }),
  );
}

/**
 * The spec also sketches a `VideoObject` per video for `/exclusive`. There is
 * no builder for it because that page renders editorial articles, not videos —
 * the `Video` model has no public page at all — and the videos it does embed
 * are still served from the old domain (a tracked pre-cutover blocker). It
 * uses `archiveGraph` below instead, describing what the page actually shows.
 */

/** `/media-mentions` and the other archives — CollectionPage + breadcrumb. */
export function archiveGraph({
  path,
  name,
  description,
  crumbName,
  items,
}: {
  path: string;
  name: string;
  description?: string | null;
  crumbName: string;
  items: { name: string; path: string }[];
}): Record<string, unknown> {
  return graph(
    collectionPage({ path, name, description, items }),
    breadcrumb({ name: crumbName }),
  );
}
