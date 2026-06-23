import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { getSiteSettings } from "@/lib/site-settings";
import { CardImageInfoSection } from "@/components/shared/CardImageInfoSection";
import { DualImageColumnSection } from "@/components/shared/DualImageColumnSection";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import {
  HeroSection,
  OurStorySection,
  DesignExperienceSection,
  WhatWeStandForSection,
  StandForColumnsSection,
  CareersSection,
  BrandResourcesSection,
  PRINCIPLES,
  VISION_MISSION,
  PRESS_ITEMS,
} from "@/components/about";

export const metadata: Metadata = {
  title: "About SwillFam — Creating Jakarta's Most Memorable Nights",
  description:
    "Discover SwillFam's story, philosophy, and mission to create unforgettable experiences in Jakarta's nightlife and hospitality scene.",
};

export default async function About() {
  const settings = await getSiteSettings();
  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <HeroSection />
      </div>

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
        <DualImageColumnSection title="" tiles={VISION_MISSION} />
      </Reveal>

      <Reveal>
        <WhatWeStandForSection />
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
          articles={PRESS_ITEMS}
          ctaLabel={null}
        />
      </Reveal>

      <Reveal>
        <BrandResourcesSection />
      </Reveal>

      <SiteFooter settings={settings} />
    </main>
  );
}
