/**
 * Shared primitives for the JSON-LD builders.
 *
 * Everything here is pure — the builders take already-fetched rows, so a page
 * never does a second query just to emit its markup.
 *
 * Two rules from the brief are enforced structurally rather than remembered:
 *
 * 1. **Never emit `""` or `null`.** Every builder's output goes through
 *    `compactDeep`, so a field the SEO team hasn't filled in simply drops out
 *    of the markup instead of appearing as an empty string. This is what lets
 *    the builders be written as if every field were present.
 * 2. **Entities are linked by `@id`, never duplicated.** The `@id`s below are
 *    fixed, so an event's `location` and a guide's `about` both point at the
 *    same venue node the venue page defines.
 */

import { siteUrl, absoluteUrl } from "@/lib/site-url";
import { plainText } from "@/lib/seo/text";

/** JSON-LD is plain JSON — this is the shape of anything the builders produce. */
export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export type JsonLdNode = { [key: string]: JsonLdValue };

/**
 * Recursively strips values that must not appear in the output: `undefined`,
 * `null`, empty/whitespace strings, and containers left empty once their own
 * children were stripped.
 *
 * `false` and `0` are kept — they are meaningful values, not absences
 * (`acceptsReservations: false` says something).
 */
export function compactDeep<T extends JsonLdValue>(value: T): T | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return (trimmed === "" ? undefined : trimmed) as T | undefined;
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => compactDeep(item))
      .filter((item): item is JsonLdValue => item !== undefined);
    return (items.length === 0 ? undefined : items) as T | undefined;
  }

  if (typeof value === "object") {
    const out: Record<string, JsonLdValue> = {};
    for (const [key, raw] of Object.entries(value)) {
      const cleaned = compactDeep(raw);
      if (cleaned !== undefined) out[key] = cleaned;
    }
    // A node holding nothing but its own @type carries no information.
    const meaningful = Object.keys(out).filter((k) => k !== "@type" && k !== "@context");
    return (meaningful.length === 0 ? undefined : out) as T | undefined;
  }

  return value;
}

/** Wraps nodes in the one `@graph` block a page emits. */
export function graph(...nodes: (JsonLdNode | undefined)[]): Record<string, unknown> {
  const items = nodes
    .map((node) => (node ? compactDeep(node) : undefined))
    .filter((node): node is JsonLdNode => node !== undefined);

  return { "@context": "https://schema.org", "@graph": items };
}

// --- Fixed @ids ------------------------------------------------------------
//
// The bare origin, deliberately without a trailing slash. Fase 2 established
// that Next normalises the root canonical to `https://swillfam.com` and will
// not emit `https://swillfam.com/`, and sitemap.ts matches that form. The
// schema samples write the root with a slash, but having three different
// spellings of the homepage in our own output is what invites a crawler to
// treat them as separate URLs — so one spelling wins everywhere.

export const ORG_ID = `${siteUrl()}/#organization`;
export const WEBSITE_ID = `${siteUrl()}/#website`;

export const venueId = (slug: string) => `${absoluteUrl(`/venues/${slug}`)}#venue`;
export const talentId = (slug: string) => `${absoluteUrl(`/talents/${slug}`)}#person`;
export const eventId = (slug: string) => `${absoluteUrl(`/events/${slug}`)}#event`;
export const articleId = (slug: string) => `${absoluteUrl(`/guides/${slug}`)}#article`;
export const pageId = (path: string) => `${pageUrl(path)}#page`;

/** Reference to another node, by `@id` alone — never a second copy of it. */
export const ref = (id: string) => ({ "@id": id });

/**
 * Absolute URL for a page. The homepage is the bare origin, matching its
 * canonical and its sitemap entry (see the note above).
 */
export function pageUrl(path: string): string {
  return path === "/" ? siteUrl() : absoluteUrl(path);
}

/**
 * A site-relative path, or an already-absolute URL left alone.
 *
 * Some list items point off-site — `/media-mentions` links to the publications
 * that wrote about SwillFam — so the list builders accept both.
 */
export function urlOrPath(value: string): string {
  return /^https?:\/\//i.test(value) ? value : pageUrl(value);
}

/**
 * Absolute URL for an image, or undefined when there is none.
 *
 * Must be the original file path. A `/_next/image?url=…` URL is explicitly
 * rejected by the brief's QA: crawlers and chat previews fetch these directly
 * and the optimiser route is not a stable image endpoint for them.
 */
export function imageUrl(path: string | null | undefined): string | undefined {
  const trimmed = path?.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return absoluteUrl(trimmed);
}

/** Absolute URLs for a list of image paths, empty entries dropped. */
export function imageUrls(...paths: (string | null | undefined)[]): string[] {
  return paths.flatMap((path) => {
    const url = imageUrl(path);
    return url ? [url] : [];
  });
}

// --- Jakarta addresses and dates -------------------------------------------

/**
 * The parts of a `PostalAddress` that are identical for every SwillFam venue.
 *
 * Kept here rather than in eight database rows: they are facts about the city,
 * not about a venue, and duplicating them per row would be eight chances to
 * disagree. Only `streetAddress` and `postalCode` come from the venue.
 */
const ADDRESS_LOCALITY = "Jakarta Selatan";
const ADDRESS_REGION = "DKI Jakarta";
const ADDRESS_COUNTRY = "ID";

export function postalAddress({
  streetAddress,
  postalCode,
}: {
  streetAddress?: string | null;
  postalCode?: string | null;
}): JsonLdNode {
  return {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality: ADDRESS_LOCALITY,
    addressRegion: ADDRESS_REGION,
    postalCode,
    addressCountry: ADDRESS_COUNTRY,
  };
}

export const JAKARTA_OFFSET = "+07:00";

/**
 * `2026-11-14T22:00:00+07:00` from a stored date plus an `"HH:mm"` hour.
 *
 * Event dates land in the database as **UTC midnight** of the intended local
 * day (the admin's `<input type="date">` via `toDateInputValue`), so the
 * calendar day must be read with UTC getters — local getters would shift the
 * date for anyone west of Greenwich. `event-calendar.ts` documents the same
 * contract and this follows it.
 *
 * `dayOffset` moves the result forward a day, for an event that ends after
 * midnight.
 */
export function jakartaDateTime(date: Date, hhmm: string, dayOffset = 0): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  const hours = match ? Number(match[1]) : 0;
  const minutes = match ? Number(match[2]) : 0;

  const day = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + dayOffset),
  );
  const y = day.getUTCFullYear();
  const m = String(day.getUTCMonth() + 1).padStart(2, "0");
  const d = String(day.getUTCDate()).padStart(2, "0");
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  return `${y}-${m}-${d}T${hh}:${mm}:00${JAKARTA_OFFSET}`;
}

/**
 * A stored timestamp as a Jakarta-offset ISO string.
 *
 * Used for `datePublished` / `dateModified`, where the instant is real (a row's
 * `updatedAt`) rather than a calendar day typed by an admin — so this converts
 * the instant into Jakarta time instead of reading UTC parts verbatim.
 */
export function jakartaInstant(date: Date): string {
  const shifted = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return `${shifted.toISOString().slice(0, 19)}${JAKARTA_OFFSET}`;
}

// --- Breadcrumbs and FAQs --------------------------------------------------

/** One breadcrumb step. The last one carries no `item`, per Google's guidance. */
export type Crumb = { name: string; path?: string };

/**
 * `BreadcrumbList` from Home down to the current page.
 *
 * Home is prepended here so no caller can forget it, and the final crumb is
 * expected to omit its path — the page you are on is not a link.
 */
export function breadcrumb(...crumbs: Crumb[]): JsonLdNode {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    itemListElement: all.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.path ? pageUrl(crumb.path) : undefined,
    })),
  };
}

/**
 * `FAQPage` from the FAQs the page actually renders, or undefined when there
 * are none.
 *
 * Answers are stored as rich text, so `plainText` strips the markup — a
 * `Question`'s `acceptedAnswer.text` is plain text, and leaving HTML in it is
 * a validator error.
 *
 * This is only honest because `AccordionContent` renders its answers into the
 * HTML even while collapsed. Marking up an answer a visitor cannot find on the
 * page is exactly what the brief forbids, so if that ever regresses this
 * builder has to go with it.
 */
export function faqPage(faqs: { question: string; answer: string }[]): JsonLdNode | undefined {
  if (faqs.length === 0) return undefined;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: plainText(faq.question),
      acceptedAnswer: { "@type": "Answer", text: plainText(faq.answer) },
    })),
  };
}

/**
 * `CollectionPage` + `ItemList` for an archive page.
 *
 * `name`/`description` come from the page's own resolved metadata, so the
 * markup and the `<title>`/`<meta>` can't describe the page differently.
 */
export function collectionPage({
  path,
  name,
  description,
  items,
}: {
  path: string;
  name: string;
  description?: string | null;
  /** `path` may be site-relative or an absolute off-site URL. */
  items: { name: string; path: string }[];
}): JsonLdNode {
  return {
    "@type": "CollectionPage",
    "@id": pageId(path),
    url: pageUrl(path),
    name,
    description,
    isPartOf: ref(WEBSITE_ID),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: urlOrPath(item.path),
        name: item.name,
      })),
    },
  };
}
