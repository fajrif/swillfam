import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { ContinueExperience } from "@/components/category";
import { VenuesIntro, VenuesCategories, VenueLocator } from "@/components/venues";

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
    <StickyHero
      backdrop={
          <Image
            src="/home/hero.png"
            alt="SwillFam venues"
            fill
            className="object-cover"
            priority
          />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Creating Jakarta&apos;s Most Memorable Nights
          </h1>
        </Container>
      }
    >
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
    </StickyHero>
  );
}
