import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { formatDateRange } from "@/lib/date";
import { Reveal } from "@/components/Reveal";
import { type OfferCardData } from "@/components/shared/OfferCard";
import {
  ExperienceHero,
  OneDaySection,
  ExperienceMap,
  WantUsToPlanSection,
  WhatsHappeningSection,
  CurrentPromotionsSection,
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
  const [settings, articles, promotions] = await Promise.all([
    getSiteSettings(),
    getArticleRows(3),
    prisma.promotion.findMany({
      orderBy: { startDate: "desc" },
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

  return (
    <>
      <ExperienceHero />

      <Reveal>
        <OneDaySection />
      </Reveal>

      <Reveal>
        <ExperienceMap />
      </Reveal>

      <Reveal>
        <WantUsToPlanSection settings={settings} />
      </Reveal>

      <Reveal>
        <WhatsHappeningSection />
      </Reveal>

      {currentPromotions.length > 0 ? (
        <Reveal>
          <CurrentPromotionsSection promotions={currentPromotions} />
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
    </>
  );
}
