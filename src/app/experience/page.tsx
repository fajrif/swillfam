import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
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

export const metadata: Metadata = {
  title: "The SwillFam Experience | SwillFam",
  description:
    "One day, different ways to experience SwillFam — a journey through the city from morning coffee to late-night events across our venues.",
};

export default async function ExperiencePage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <ExperienceHero />
      </div>

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

      <Reveal>
        <CurrentPromotionsSection />
      </Reveal>

      <Reveal>
        <ArticleListSection
          title="Your Guide to the SCBD Nightlife Experience"
          lead="Explore our guide to planning a night out around SCBD and nearby SwillFam venues. Discover where to start, where to eat, where to drink, and how to continue the night across our lifestyle and nightlife destinations."
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

      <SiteFooter settings={settings} />
    </main>
  );
}
