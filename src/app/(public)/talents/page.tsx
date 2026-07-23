import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getArticleRows } from "@/lib/articles";
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

// Statically rendered but data-driven (talents, venues, categories, articles) —
// revalidate periodically so admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Talents | SwillFam",
  description:
    "Meet the DJs, chefs, bartenders, and special guests behind the SwillFam experience.",
};

export default async function TalentsPage() {
  const [articles, talents, venues, categories] = await Promise.all([
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
    slug: t.slug,
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
    <>
      <TalentsHero />

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
    </>
  );
}
