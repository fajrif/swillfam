import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { ExclusiveHero, ExclusiveSection } from "@/components/exclusive";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";

export const metadata: Metadata = {
  title: "Exclusive | SwillFam",
  description:
    "Stories, moments, and first looks from across the SwillFam family of venues — a curated gallery of celebrations, events, and nightlife.",
};

export default async function ExclusivePage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <ExclusiveHero />
      </div>

      <Reveal>
        <ExclusiveSection />
      </Reveal>

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <ArticleListSection />
      </Reveal>

      <SiteFooter settings={settings} />
    </main>
  );
}
