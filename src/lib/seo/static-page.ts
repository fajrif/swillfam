import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  STATIC_PAGE_SEO_BY_KEY,
  type StaticPageSeoKey,
} from "@/lib/page-seo-registry";
import { buildMetadata, resolveDescription } from "./metadata";

/**
 * cache() so a page that needs its PageSeo row for anything else — and the
 * admin SEO panel in Fase 6 — shares one read per request with this.
 */
export const getPageSeo = cache((pageKey: string) =>
  prisma.pageSeo.findUnique({ where: { pageKey } }),
);

/**
 * Metadata for one of the 16 singleton/archive pages.
 *
 * These pages had 16 identical copies of a four-line `generateMetadata` that
 * fell back to the bare title "SwillFam" with no description and no canonical.
 * Routing them all through here means a change to the tag set — a new OG
 * field, a different truncation rule — lands on all of them at once, and the
 * admin's Page SEO row still overrides the registry defaults per page.
 */
export async function staticPageMetadata(
  key: StaticPageSeoKey,
): Promise<Metadata> {
  const def = STATIC_PAGE_SEO_BY_KEY[key];
  const seo = await getPageSeo(key);

  return buildMetadata({
    path: def.path,
    title: seo?.metaTitle?.trim() || def.defaultTitle,
    description: resolveDescription(
      seo?.metaDescription,
      def.defaultDescription,
    ),
    image: seo?.ogImage,
  });
}
