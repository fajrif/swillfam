import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import {
  TalentsHero,
  TalentsIntro,
  TalentsBrowser,
  type TalentCardData,
} from "@/components/talents";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { DestinationsFeatureBand } from "@/components/shared/DestinationsFeatureBand";

export const metadata: Metadata = {
  title: "Talents | SwillFam",
  description:
    "Meet the DJs, chefs, bartenders, and special guests behind the SwillFam experience.",
};

export default async function TalentsPage() {
  const [settings, articles, talents, venues, categories] = await Promise.all([
    getSiteSettings(),
    getArticleRows(3),
    prisma.talent.findMany({
      orderBy: { name: "asc" },
      include: {
        venue: { select: { name: true, logo: true } },
        talentCategory: { select: { id: true, name: true } },
      },
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.talentCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const talentCards: TalentCardData[] = talents.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    image: t.image,
    venueId: t.venueId,
    talentCategoryId: t.talentCategoryId,
    venueName: t.venue?.name ?? null,
    venueLogo: t.venue?.logo ?? null,
    categoryName: t.talentCategory?.name ?? null,
  }));

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <TalentsHero />
      </div>

      <TalentsIntro />

      <TalentsBrowser talents={talentCards} venues={venues} categories={categories} />

      <Reveal>
        <DestinationsFeatureBand />
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
