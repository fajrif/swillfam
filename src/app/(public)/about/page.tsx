import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { PlasmaBackground } from "@/components/reactbits/PlasmaBackground";
import { CardImageInfoSection } from "@/components/shared/CardImageInfoSection";
import { DualImageColumnSection } from "@/components/shared/DualImageColumnSection";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { getArticleRows } from "@/lib/articles";
import {
  OurStorySection,
  DesignExperienceSection,
  WhatWeStandForFlowingSection,
  StandForColumnsSection,
  CareersSection,
  BrandResourcesSection,
  PRINCIPLES,
  VISION_MISSION,
} from "@/components/about";

// Statically rendered but data-driven (articles) — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "About SwillFam — Creating Jakarta's Most Memorable Nights",
  description:
    "Discover SwillFam's story, philosophy, and mission to create unforgettable experiences in Jakarta's nightlife and hospitality scene.",
};

export default async function About() {
  const articles = await getArticleRows(3);
  return (
    <StickyHero
      backdrop={
        <PlasmaBackground
          className="absolute inset-0"
          color="#c6387f"
          speed={0.2}
          direction="pingpong"
          scale={2.3}
          opacity={0.8}
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
        <OurStorySection />
      </Reveal>

      <Reveal>
        <DesignExperienceSection />
      </Reveal>

      <Reveal>
        <CardImageInfoSection
          title="Our philosophy is grounded in three principles:"
          lead=""
          align="center"
          cards={PRINCIPLES}
        />
      </Reveal>

      <Reveal>
        <DualImageColumnSection title="" parallax tiles={VISION_MISSION} />
      </Reveal>

      <Reveal>
        <WhatWeStandForFlowingSection />
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
