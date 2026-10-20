import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteUrl } from "@/lib/site-url";
import { STATIC_PAGE_SEO_DEFS } from "@/lib/page-seo-registry";
import { publishedVenueScope } from "@/lib/venue-scope";
import { livePromotionWhere } from "@/lib/promotion-scope";

/**
 * Regenerated on the same cadence as the pages it lists.
 *
 * A sitemap route is statically cached by default, which would freeze it at
 * build time: a venue unpublished through the admin would keep appearing until
 * the next deploy, and the brief requires every URL in here to return 200. One
 * minute bounds how long a stale entry can survive, and the queries below are
 * all indexed slug/updatedAt reads.
 */
export const revalidate = 60;

/** Rows carrying a timestamp, which is every collection queried here. */
type Dated = { updatedAt: Date };

/**
 * Absolute URL for a sitemap entry.
 *
 * The homepage is the bare origin, not `origin + "/"`. Next normalises the root
 * canonical to the bare form and will not emit a trailing slash even when
 * handed one, so matching it here keeps canonical and sitemap byte-identical —
 * a crawl that diffs the two (Screaming Frog, per the brief's QA) would
 * otherwise report every homepage hit as a canonical mismatch. It also matches
 * the brief's own "no trailing slashes" rule.
 */
function pageUrl(path: string): string {
  return path === "/" ? siteUrl() : absoluteUrl(path);
}

/**
 * Most recent `updatedAt` in a collection, or undefined if it is empty.
 *
 * Used as the archive pages' `lastModified`: /events really does change when
 * an event changes. The brief asks for "real lastmod", so pages whose content
 * is not derived from a table — /about, /contact, the legal pages — get no
 * `lastModified` at all rather than a fabricated one. Google ignores a lastmod
 * it finds untrustworthy, so inventing dates would cost us the ones that are
 * genuine.
 */
function newest(rows: Dated[]): Date | undefined {
  if (rows.length === 0) return undefined;
  return rows.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b)).updatedAt;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Each filter mirrors the guard on the matching page, so the sitemap can
  // never advertise a URL that notFound()s. See the detail routes under
  // src/app/(public)/*/[slug]/.
  const [venues, categories, events, promotions, talents, articles, privateEvents] =
    await Promise.all([
      // Unpublished venues (Atsumaru, and Kilo Cafe until its copy lands) drop
      // out here exactly as the brief's Published toggle requires.
      prisma.venue.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      // Categories are the /venues/{lifestyle,nightlife} pages — served by the
      // same [slug] dispatcher as venues, and unfiltered because the page is.
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      // Retired events keep a reachable 200 detail page on purpose (they are
      // linked from "Past Editions"), so `active` is deliberately not filtered.
      prisma.event.findMany({
        where: publishedVenueScope,
        select: { slug: true, updatedAt: true },
      }),
      // Expired offers 301 to /promotions (src/proxy.ts), and a redirected
      // URL may not sit in a sitemap.
      prisma.promotion.findMany({
        where: livePromotionWhere(new Date()),
        select: { slug: true, updatedAt: true },
      }),
      prisma.talent.findMany({
        where: { status: "RESIDENT", ...publishedVenueScope },
        select: { slug: true, updatedAt: true },
      }),
      // status 1 = Published; drafts notFound().
      prisma.article.findMany({
        where: { status: 1 },
        select: { slug: true, updatedAt: true },
      }),
      prisma.privateEvent.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

  /** Archive pages that can take a real lastmod from the rows they list. */
  const archiveLastModified: Record<string, Date | undefined> = {
    // /venues shows both the category tiles and the venue locator.
    venues: newest([...venues, ...categories]),
    events: newest(events),
    promotions: newest(promotions),
    talents: newest(talents),
    guides: newest(articles),
    "private-events": newest(privateEvents),
  };

  const staticPages: MetadataRoute.Sitemap = STATIC_PAGE_SEO_DEFS.map((def) => {
    const lastModified = archiveLastModified[def.key];
    return {
      url: pageUrl(def.path),
      ...(lastModified ? { lastModified } : {}),
    };
  });

  const detail = (prefix: string, rows: { slug: string; updatedAt: Date }[]) =>
    rows.map((row) => ({
      url: pageUrl(`${prefix}/${row.slug}`),
      lastModified: row.updatedAt,
    }));

  return [
    ...staticPages,
    // Categories before venues so /venues/lifestyle sits next to its siblings;
    // both live under /venues/{slug} via the dispatcher.
    ...detail("/venues", categories),
    ...detail("/venues", venues),
    ...detail("/events", events),
    ...detail("/promotions", promotions),
    ...detail("/talents", talents),
    ...detail("/guides", articles),
    ...detail("/private-events", privateEvents),
  ];
}
