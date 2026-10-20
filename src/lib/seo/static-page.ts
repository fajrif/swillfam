import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { StaticPageSeoKey } from "@/lib/page-seo-registry";
import { STATIC_PAGE_SEO_BY_KEY } from "@/lib/page-seo-registry";
import { buildMetadata } from "./metadata";
import { staticPageSeoValues } from "./entities";
import type { EntitySeo } from "./entities";

/**
 * cache() so a page that needs its PageSeo row for anything else — its JSON-LD
 * name, or the admin SEO panel — shares one read per request with this.
 */
export const getPageSeo = cache((pageKey: string) =>
  prisma.pageSeo.findUnique({ where: { pageKey } }),
);

/** Resolved title/description/image for one singleton page, with provenance. */
export const resolveStaticPageSeo = cache(
  async (key: StaticPageSeoKey): Promise<EntitySeo> =>
    staticPageSeoValues(key, await getPageSeo(key)),
);

/**
 * The page's own name and description, for its JSON-LD.
 *
 * Reads the same resolution as `staticPageMetadata`, so a page's markup and its
 * `<title>`/`<meta>` are always the same strings. The title keeps its brand
 * suffix out of it: `pageTitle()` adds that for the `<title>` tag, while schema
 * `name` wants the page's own name.
 */
export async function staticPageSeo(key: StaticPageSeoKey): Promise<{
  name: string;
  description: string | undefined;
}> {
  const seo = await resolveStaticPageSeo(key);
  return { name: seo.title.value, description: seo.description.value };
}

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
  const seo = await resolveStaticPageSeo(key);

  return buildMetadata({
    path: STATIC_PAGE_SEO_BY_KEY[key].path,
    title: seo.title.value,
    description: seo.description.value,
    image: seo.image.value,
  });
}
