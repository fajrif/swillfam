import type { Metadata } from "next";

export const SITE_NAME = "SwillFam";

/**
 * Longest description we will emit for a *derived* fallback. Google renders
 * roughly 155–160 characters on desktop; anything past that is cut in the SERP.
 * Hand-written values are deliberately exempt — see `resolve.ts`.
 */
export const DESCRIPTION_MAX = 155;

/**
 * Where a value stops helping and starts getting cut off in search results.
 *
 * Shared by the admin's SEO form counters and its read-only SEO Details panel,
 * so the two never disagree about what "too long" means. `min` is the point
 * below which a field is too thin to earn a click. Advisory only — nothing here
 * blocks a save.
 */
export const TITLE_RANGE = { min: 25, max: 60 };
export const DESCRIPTION_RANGE = { min: 70, max: DESCRIPTION_MAX };

/**
 * Sitewide share image. A 1200×630 crop of the homepage hero — the ratio every
 * platform expects, and small enough (88 KB) that WhatsApp will actually fetch
 * it. Replaceable with a purpose-made asset without touching any code.
 */
const DEFAULT_OG_IMAGE = { url: "/og-default.jpg", width: 1200, height: 630 };

/**
 * Prefix owned by `scripts/generate-og-images.ts`, which writes every file
 * under it at exactly 1200×630.
 *
 * That guarantee is the only reason `og:image:width`/`height` can be declared
 * for a row's own image: a hand-picked `ogImage`, or a display photo reached
 * further down the chain, could be any shape, and a platform told the wrong
 * dimensions lays out a broken card. So the tags are emitted for these and
 * withheld for everything else.
 */
const GENERATED_OG_PREFIX = "/og/";
const OG_SIZE = { width: 1200, height: 630 };

/**
 * Appends the brand to a title unless it is already there.
 *
 * The guard matters because admins type their own `metaTitle` in the SEO
 * fields and often include "| SwillFam" themselves; a Next `title.template`
 * would have no way to tell and would double it.
 */
export function pageTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed.toLowerCase().includes(SITE_NAME.toLowerCase())
    ? trimmed
    : `${trimmed} | ${SITE_NAME}`;
}

// The fallback chains that used to live here are now declared per model in
// `entities.ts` and resolved by `resolve.ts`, which also reports *where* each
// value came from so the admin panel can show it. There is deliberately no
// `resolveDescription`/`resolveOgImage` export any more: two ways to resolve
// the same value is how the route's `<meta>` and the schema builder's
// `description` drifted apart in the first place.

export type PageMetadataInput = {
  /**
   * Site-relative path of this page, used for the canonical and `og:url`.
   * Resolved against `metadataBase` into an absolute URL by Next.
   */
  path: string;
  title: string;
  description?: string | null;
  /**
   * Site-relative path to the share image. Must be the original file (an
   * `/uploads/...` or `/home/...` path), never a `/_next/image?url=` URL —
   * crawlers and chat previews fetch these directly and the optimiser route
   * is not a stable, cacheable image endpoint for them.
   */
  image?: string | null;
  imageAlt?: string;
  ogType?: "website" | "article" | "profile";
  /** Only meaningful when `ogType` is "article". */
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Keeps a page out of the index while still following its links. */
  noIndex?: boolean;
};

/**
 * Builds the complete metadata object for one page.
 *
 * Every public route goes through here, and the reason is Next's merge rule:
 * metadata is merged *shallowly*, so a page that defines `openGraph` replaces
 * the root layout's `openGraph` outright rather than extending it. A page that
 * set only `openGraph.title` would silently drop `og:site_name`, `og:locale`
 * and the fallback image. Composing the whole object in one function is what
 * guarantees all 23 routes emit a full, consistent set of tags.
 */
export function buildMetadata({
  path,
  title,
  description,
  image,
  imageAlt,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex,
}: PageMetadataInput): Metadata {
  const resolvedTitle = pageTitle(title);
  const desc = description?.trim() || undefined;

  const url = image?.trim();
  const ogImage = url
    ? {
        url,
        alt: imageAlt ?? resolvedTitle,
        ...(url.startsWith(GENERATED_OG_PREFIX) ? OG_SIZE : {}),
      }
    : { ...DEFAULT_OG_IMAGE, alt: imageAlt ?? SITE_NAME };

  return {
    title: resolvedTitle,
    description: desc,
    // Resolved against metadataBase. Note that Next normalises the root to a
    // bare origin with no path ("https://swillfam.com") and will not emit
    // "https://swillfam.com/" even if handed that absolute URL — verified. It
    // is sitemap.ts that matches this form, not the other way round.
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      url: path,
      siteName: SITE_NAME,
      title: resolvedTitle,
      description: desc,
      locale: "en_US",
      images: [ogImage],
      ...(ogType === "article" ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: desc,
      images: [ogImage.url],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
