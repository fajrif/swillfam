import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { GlassRefractionBackground } from "@/components/reactbits/GlassRefractionBackground";
import { CardImageInfoSection } from "@/components/shared/CardImageInfoSection";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { SwillfamSpotlightSection } from "@/components/venues";

import { getArticleRows } from "@/lib/articles";
import {
  OurStorySection,
  DesignExperienceSection,
  WhatWeStandForFlowingSection,
  StandForColumnsSection,
  CareersSection,
  BrandResourcesSection,
  PRINCIPLES,
} from "@/components/about";

// Statically rendered but data-driven (articles) — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.pageSeo.findUnique({ where: { pageKey: "about" } });
  return {
    title: seo?.metaTitle ?? "SwillFam",
    description: seo?.metaDescription ?? undefined,
  };
}

export default async function About() {
  const [articles] = await Promise.all([
    getArticleRows(3),
  ]);
  return (
    <StickyHero
      backdrop={
        <GlassRefractionBackground className="absolute inset-0" />
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
        <OurStorySection />
      </Reveal>

      <Reveal>
        <DesignExperienceSection />
      </Reveal>

      <Reveal>
        <CardImageInfoSection
          title="Our Philosophy"
          lead="Rooted in a few core factors that shape every SwillFam venue, no matter how different they feel from one another."
          align="center"
          cards={PRINCIPLES}
        />
      </Reveal>

      <Reveal>
        <WhatWeStandForFlowingSection />
      </Reveal>

      <Reveal>
        <SwillfamSpotlightSection />
      </Reveal>

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <CareersSection />
      </Reveal>

      <Reveal>
        <ArticleListSection
          title="Press & Media"
          lead="For media mentions, press inquiries, brand information, and official assets, visit the SwillFam Press page. Find selected articles, downloadable press kits, logos, and related media resources for SwillFam and our venues."
          articles={articles}
          ctaLabel={null}
        />
      </Reveal>

      <Reveal>
        <BrandResourcesSection />
      </Reveal>
    </StickyHero>
  );
}
