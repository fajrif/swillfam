import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getArticleRows } from "@/lib/articles";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import {
  PromotionsIntro,
  PromotionsBrowser,
  type PromoCard,
} from "@/components/promotions";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { DestinationsFeatureBand } from "@/components/shared/DestinationsFeatureBand";

// Statically rendered but data-driven (promotions, venues, categories, articles) —
// revalidate periodically so admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Promotions | SwillFam",
  description:
    "Check out the latest promotions, deals, and special offers across SwillFam venues.",
};

export default async function PromotionsPage() {
  const [articles, promotions, venues, categories] = await Promise.all([
    getArticleRows(3),
    prisma.promotion.findMany({
      orderBy: { startDate: "desc" },
      include: {
        venue: { select: { name: true, logo: true } },
        promotionCategory: { select: { id: true, name: true } },
      },
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.promotionCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const promoCards: PromoCard[] = promotions.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    image: p.image ?? p.posterImage,
    venueId: p.venueId,
    promotionCategoryId: p.promotionCategoryId,
    venueName: p.venue?.name ?? null,
    venueLogo: p.venue?.logo ?? null,
    startDate: p.startDate,
    endDate: p.endDate,
  }));

  return (
    <StickyHero
      backdrop={
        <ParallaxImage>
          <Image src="/promotions/banner.png" alt="" fill className="object-cover" priority />
        </ParallaxImage>
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Food, Drinks, Ladies Night &amp; Venue Offers
          </h1>
        </Container>
      }
    >
      <PromotionsIntro />

      <PromotionsBrowser promotions={promoCards} venues={venues} categories={categories} />

      <Reveal>
        <DestinationsFeatureBand />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
    </StickyHero>
  );
}
