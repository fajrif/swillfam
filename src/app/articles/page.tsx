import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { getSiteSettings } from "@/lib/site-settings";
import { ArticlesHero, ArticlesBrowser } from "@/components/articles";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";

export const metadata: Metadata = {
  title: "Articles & Journals | SwillFam",
  description:
    "Stories, recommendations, and insider guides from the SwillFam world — nightlife, lifestyle, talents, and the people who make every night memorable.",
};

export default async function ArticlesPage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <ArticlesHero />
      </div>

      <Reveal>
        <ArticlesBrowser />
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
