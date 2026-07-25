import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoryVenuesLogoSection, type CategoryVenuesTileData } from "@/components/shared/CategoryVenuesLogoSection";
import { OfferCardSection } from "@/components/shared/OfferCardSection";
import { type OfferCardData } from "@/components/shared/OfferCard";
import { Experience } from "@/components/home/Experience";
import { CardImageInfoSection } from "@/components/shared/CardImageInfoSection";
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

export const metadata: Metadata = {
  title: "SwillFam — Discover the City's Best Lifestyle & Nightlife Experiences",
  description:
    "SwillFam connects people with the city's best venues, events, and stories — from casual nights out to curated social experiences and exclusive gatherings.",
};

export default async function Home() {
  const [settings, articles, events, categories] = await Promise.all([
    getSiteSettings(),
    getArticleRows(3),
    prisma.event.findMany({
      where: { isPrivate: false, active: true },
      orderBy: { startDate: "asc" },
      take: 3,
      include: { venue: { select: { name: true, logo: true } } },
    }),
    prisma.category.findMany({
      include: { venues: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const featuredEvent = await prisma.event.findFirst({
    where: { isPrivate: false, active: true, featured: true },
    orderBy: { startDate: "asc" },
    select: { image: true, name: true, shortDescription: true, caption: true, slug: true },
  });

  const categoryTiles: CategoryVenuesTileData[] = categories.map((cat, i) => ({
    src: cat.image ?? "/home/hero.png",
    label: cat.name,
    labelAlign: i % 2 === 0 ? "top-left" : "bottom-right",
    description: cat.shortDescription ?? undefined,
    href: `/category/${cat.slug}`,
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
    <Hero featuredEvent={featuredEvent}>
      <Reveal>
        <CategoryVenuesLogoSection
          parallax
          tiles={categoryTiles}
        />
      </Reveal>
      {upcomingEvents.length > 0 ? (
        <Reveal>
          <OfferCardSection
            title="Upcoming Events"
            lead="Stay updated with upcoming events, special programs, parties, collaborations, and community gatherings happening across Swillfam's network."
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
        <CardImageInfoSection />
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
