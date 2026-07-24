import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DualImageColumnSection } from "@/components/shared/DualImageColumnSection";
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
  const [settings, articles, events] = await Promise.all([
    getSiteSettings(),
    getArticleRows(3),
    prisma.event.findMany({
      where: { isPrivate: false, active: true },
      orderBy: { startDate: "asc" },
      take: 3,
      include: { venue: { select: { name: true, logo: true } } },
    }),
  ]);

  const upcomingEvents: OfferCardData[] = events.map((e) => ({
    id: e.id,
    image: e.image ?? e.posterImage,
    title: e.name,
    description: e.shortDescription,
    venueName: e.venue?.name ?? null,
    venueLogo: e.venue?.logo ?? null,
    meta: formatEventSchedule(e),
    href: `/events/${e.slug}`,
  }));

  return (
    <Hero>
      <Reveal>
        <DualImageColumnSection
          parallax
          tiles={[
            { src: "/home/category-lifestyle.png", label: "Lifestyle", labelAlign: "top-left", href: "/category/lifestyle" },
            { src: "/home/category-nightlife.png", label: "Nightlife", labelAlign: "bottom-right", href: "/category/nightlife" },
          ]}
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
