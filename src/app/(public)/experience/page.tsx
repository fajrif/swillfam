import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { formatDateRange } from "@/lib/date";
import { formatEventSchedule } from "@/lib/event-calendar";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { type OfferCardData } from "@/components/shared/OfferCard";
import { OfferCardSection } from "@/components/shared/OfferCardSection";
import {
  OneDaySection,
  ExperienceMap,
  MomentWeveHostedSection,
  WantUsToPlanSection,
} from "@/components/experience";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";

// Statically rendered but data-driven (articles) — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "The SwillFam Experience | SwillFam",
  description:
    "One day, different ways to experience SwillFam — a journey through the city from morning coffee to late-night events across our venues.",
};

export default async function ExperiencePage() {
  const [settings, articles, promotions, events] = await Promise.all([
    getSiteSettings(),
    getArticleRows(3),
    prisma.promotion.findMany({
      orderBy: { startDate: "desc" },
      take: 3,
      include: { venue: { select: { name: true, logo: true } } },
    }),
    prisma.event.findMany({
      where: { isPrivate: false, active: true },
      orderBy: { startDate: "asc" },
      take: 3,
      include: { venue: { select: { name: true, logo: true } } },
    }),
  ]);

  const currentPromotions: OfferCardData[] = promotions.map((p) => ({
    id: p.id,
    image: p.image ?? p.posterImage,
    title: p.name,
    description: p.shortDescription,
    venueName: p.venue?.name ?? null,
    venueLogo: p.venue?.logo ?? null,
    meta: formatDateRange(p.startDate, p.endDate),
    href: `/promotions/${p.slug}`,
  }));

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
    <StickyHero
      backdrop={
        <Image src="/experience/banner.png" alt="" fill priority className="object-cover" />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Your Day, Our Way
          </h1>
        </Container>
      }
    >
      <Reveal>
        <OneDaySection />
      </Reveal>

      <Reveal>
        <ExperienceMap />
      </Reveal>

      <Reveal>
        <MomentWeveHostedSection />
      </Reveal>

      <Reveal>
        <WantUsToPlanSection settings={settings} />
      </Reveal>

      {upcomingEvents.length > 0 ? (
        <Reveal>
          <OfferCardSection
            title="What's Happening This Week"
            lead="Explore upcoming events across SwillFam venues and see what is happening this week. From dining experiences and regular programs to music nights and special events, there is always something to discover."
            offers={upcomingEvents}
          />
        </Reveal>
      ) : null}

      {currentPromotions.length > 0 ? (
        <Reveal>
          <OfferCardSection
            title="Current Promotions"
            lead="Make your next SwillFam visit even better with active promotions across our venues. Explore selected offers for food, drinks, ladies night, group packages, table deals, and seasonal specials."
            offers={currentPromotions}
          />
        </Reveal>
      ) : null}

      <Reveal>
        <ArticleListSection
          title="Your Guide to the SCBD Nightlife Experience"
          lead="Explore our guide to planning a night out around SCBD and nearby SwillFam venues. Discover where to start, where to eat, where to drink, and how to continue the night across our lifestyle and nightlife destinations."
          articles={articles}
          ctaLabel="See All Guides"
          ctaHref="/articles"
        />
      </Reveal>

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>
    </StickyHero>
  );
}
