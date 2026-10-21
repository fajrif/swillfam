import { staticPageMetadata } from "@/lib/seo/static-page";
import { prisma } from "@/lib/prisma";
import { upcomingEventWhere } from "@/lib/event-scope";
import { CategoryVenuesLogoSection, type CategoryVenuesTileData } from "@/components/shared/CategoryVenuesLogoSection";
import { OfferCardSection } from "@/components/shared/OfferCardSection";
import { type OfferCardData } from "@/components/shared/OfferCard";
import { Experience } from "@/components/home/Experience";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { ExclusiveRecap } from "@/components/home/ExclusiveRecap";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/Reveal";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { formatEventSchedule } from "@/lib/event-calendar";

// Statically rendered but data-driven (articles) — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const generateMetadata = () => staticPageMetadata("home");

export default async function Home() {
  const now = new Date();

  const [settings, articles, events, categories] = await Promise.all([
    getSiteSettings(),
    getArticleRows(3),
    // "On the Calendar" — upcoming only, by the same rule as /events.
    prisma.event.findMany({
      where: upcomingEventWhere(now),
      orderBy: { startDate: "asc" },
      take: 3,
      include: { venue: { select: { name: true, logo: true } } },
    }),
    prisma.category.findMany({
      include: { venues: { where: { published: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const featuredEvents = await prisma.event.findMany({
    where: { featured: true, ...upcomingEventWhere(now) },
    orderBy: { startDate: "asc" },
    take: 3,
    select: { image: true, name: true, shortDescription: true, caption: true, slug: true },
  });

  const categoryTiles: CategoryVenuesTileData[] = categories.map((cat, i) => ({
    src: cat.image ?? "/home/hero.png",
    label: cat.name,
    labelAlign: i % 2 === 0 ? "top-left" : "bottom-right",
    description: cat.shortDescription ?? undefined,
    href: `/venues/${cat.slug}`,
    logos: cat.venues.filter((v) => v.logo).map((v) => ({ src: v.logo!, alt: v.name })),
  }));

  const nightlifeTile = categoryTiles.find((t) => t.label === "Nightlife");
  if (nightlifeTile) {
    nightlifeTile.logos.push({ src: "/logo-swillfam.png", alt: "SwillFam" });
  }

  const upcomingEvents: OfferCardData[] = events.map((e) => ({
    id: e.id,
    image: e.image ?? e.posterImage,
    title: e.name,
    description: e.shortDescription,
    caption: e.caption,
    venueName: e.venue?.name ?? null,
    venueLogo: e.venue?.logo ?? null,
    meta: formatEventSchedule(e),
    href: `/events/${e.slug}`,
  }));

  return (
    <Hero featuredEvents={featuredEvents}>
      <Reveal>
        <CategoryVenuesLogoSection
          parallax
          tiles={categoryTiles}
        />
      </Reveal>
      {upcomingEvents.length > 0 ? (
        <Reveal>
          <OfferCardSection
            title="On the Calendar"
            lead="New nights, new lineups, new reasons to show up. Here's what's happening across SwillFam venues."
            offers={upcomingEvents}
            ctaText="See all events"
            ctaHref="/events"
          />
        </Reveal>
      ) : null}
      <Reveal>
        <Experience />
      </Reveal>
      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
      <Reveal>
        <ExclusiveRecap youtubeUrl={settings.socialYoutube} />
      </Reveal>
    </Hero>
  );
}
