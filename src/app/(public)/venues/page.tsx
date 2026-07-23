import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { Reveal } from "@/components/Reveal";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { ContinueExperience } from "@/components/category";
import { VenuesHero, VenuesIntro, VenuesCategories, VenueLocator } from "@/components/venues";

// Statically rendered but data-driven (categories, venues, articles) — revalidate
// periodically so admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Venues | SwillFam",
  description:
    "Explore SwillFam's distinctive venues — each with its own concept, atmosphere, and experience. Browse by category and find every destination on the map.",
};

export default async function VenuesPage() {
  const [settings, categories, venues, articles] = await Promise.all([
    getSiteSettings(),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.venue.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        operatingHours: true,
        lat: true,
        lng: true,
      },
    }),
    getArticleRows(3),
  ]);

  return (
    <>
      <VenuesHero />

      <Reveal>
        <VenuesIntro />
      </Reveal>

      <Reveal>
        <VenuesCategories categories={categories} />
      </Reveal>

      <Reveal>
        <VenueLocator venues={venues} whatsapp={settings.mainWhatsapp} />
      </Reveal>

      <Reveal>
        <ContinueExperience />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
    </>
  );
}
