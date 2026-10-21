import { cache } from "react";
import { ReactLenis } from "lenis/react";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { getSiteSettings } from "@/lib/site-settings";
import { JsonLd } from "@/components/shared/JsonLd";
import { orgGraph } from "@/lib/schema";
import { ScrollToTopOnNavigate } from "@/components/shared/ScrollToTopOnNavigate";
import "lenis/dist/lenis.css";

/**
 * Published venues, for `Organization.subOrganization`.
 *
 * Built from the table rather than a hard-coded list so a venue switched off in
 * the admin (Atsumaru at launch) drops out of the organisation graph by itself,
 * and a new one appears without a deploy — the same rule the sitemap follows.
 * `cache()` keeps it to one query per request.
 */
const getPublishedVenueSlugs = cache(async () => {
  const venues = await prisma.venue.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
    select: { slug: true },
  });
  return venues.map((venue) => venue.slug);
});

/**
 * The public chrome, plus the `Organization` + `WebSite` JSON-LD every page
 * carries exactly once.
 *
 * The schema spec puts that block in `app/layout.tsx`. It lives here instead
 * because the root layout also wraps `/admin`, which is `noindex, nofollow` and
 * has no business describing the organisation to crawlers — and because this
 * layout is already an async Server Component holding `settings`, so the block
 * costs no extra fetch. Every indexable route is inside this group.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, venueSlugs] = await Promise.all([
    getSiteSettings(),
    getPublishedVenueSlugs(),
  ]);

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-body">
      {/* Lenis owns scroll smoothing on the public site only — the admin is
          plain scrolling, and Lenis's wheel hijack made its scrollable code
          blocks unreachable. CSS scroll-behavior:smooth is deliberately not
          used alongside it (the two fight each other). */}
      <ReactLenis root options={{ anchors: true }} />
      <ScrollToTopOnNavigate />
      <JsonLd data={orgGraph({ settings, venueSlugs })} />
      <div className="relative">
        <SiteHeader settings={settings} />
      </div>
      {children}
      <SiteFooter settings={settings} />
    </main>
  );
}
