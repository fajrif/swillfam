import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import {
  PromotionsHero,
  PromotionsIntro,
  PromotionsBrowser,
  PromotionsFeatureBand,
  type PromoCard,
} from "@/components/promotions";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";

export const metadata: Metadata = {
  title: "Promotions | SwillFam",
  description:
    "Check out the latest promotions, deals, and special offers across SwillFam venues.",
};

export default async function PromotionsPage() {
  const [settings, articles, promotions, venues, categories] = await Promise.all([
    getSiteSettings(),
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
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <PromotionsHero />
      </div>

      <PromotionsIntro />

      <PromotionsBrowser promotions={promoCards} venues={venues} categories={categories} />

      <Reveal>
        <PromotionsFeatureBand />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>

      <SiteFooter settings={settings} />
    </main>
  );
}
