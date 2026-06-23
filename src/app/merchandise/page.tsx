import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { getSiteSettings } from "@/lib/site-settings";
import {
  MerchandiseHero,
  EssentialsSection,
  ProductGrid,
  PrivateEventsSection,
} from "@/components/merchandise";
import { StandForColumnsSection } from "@/components/about";
import { ArticleListSection } from "@/components/shared/ArticleListSection";

export const metadata: Metadata = {
  title: "Merchandise | SwillFam",
  description:
    "SwillFam merchandise made for those who live the scene beyond the venue — selected pieces inspired by our venues, events, and lifestyle culture.",
};

export default async function MerchandisePage() {
  const settings = await getSiteSettings();
  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <MerchandiseHero />
      </div>

      <Reveal>
        <EssentialsSection />
      </Reveal>

      <Reveal>
        <ProductGrid />
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
