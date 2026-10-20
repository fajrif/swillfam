import type { Metadata } from "next";
import { plainText, truncate } from "./text";

export const SITE_NAME = "SwillFam";

/**
 * Longest description we will emit for a *derived* fallback. Google renders
 * roughly 155–160 characters on desktop; anything past that is cut in the SERP.
 * Hand-written values are deliberately exempt — see `resolveDescription`.
 */
export const DESCRIPTION_MAX = 155;

/**
 * Sitewide share image. A 1200×630 crop of the homepage hero — the ratio every
 * platform expects, and small enough (88 KB) that WhatsApp will actually fetch
 * it. Replaceable with a purpose-made asset without touching any code.
 */
const DEFAULT_OG_IMAGE = { url: "/og-default.jpg", width: 1200, height: 630 };

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

/**
 * Picks the description for a page and cleans it up.
 *
 * `manual` is whatever an admin typed into Meta Description. It is returned
 * verbatim: they may have had a reason to run long, and the character counter
 * on the form already warns them. Everything after it is *derived* from body
 * copy, so it gets stripped of markup and cut to `DESCRIPTION_MAX` — this is
 * the fix for `/venues/[slug]`, which was emitting a 700-character meta
 * description by falling back to the full `venue.description` paragraph.
 */
export function resolveDescription(
  manual: string | null | undefined,
  ...fallbacks: (string | null | undefined)[]
): string | undefined {
  const trimmedManual = manual?.trim();
  if (trimmedManual) return trimmedManual;

  for (const candidate of fallbacks) {
    const cleaned = candidate ? plainText(candidate) : "";
    if (cleaned) return truncate(cleaned, DESCRIPTION_MAX);
  }

  return undefined;
}

/** First non-empty image path in the chain, as a site-relative path. */
export function resolveOgImage(
  ...candidates: (string | null | undefined)[]
): string | undefined {
  return candidates.find((c) => !!c?.trim())?.trim();
}

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

  const ogImage = image?.trim()
    ? { url: image.trim(), alt: imageAlt ?? resolvedTitle }
    : { ...DEFAULT_OG_IMAGE, alt: imageAlt ?? SITE_NAME };

  return {
    title: resolvedTitle,
    description: desc,
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
