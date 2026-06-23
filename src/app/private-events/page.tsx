import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import {
  PrivateEventsHero,
  VisionSection,
  EventTypesSection,
  MomentsCarousel,
  FaqSection,
} from "@/components/private-events";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";

export const metadata: Metadata = {
  title: "Private Events | SwillFam",
  description:
    "Host corporate functions, birthdays, brand activations, and celebrations across SwillFam's distinctive venues — events designed around your vision.",
};

export default async function PrivateEventsPage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <PrivateEventsHero />
      </div>

      <Reveal>
        <VisionSection />
      </Reveal>

      <Reveal>
        <EventTypesSection />
      </Reveal>

      <Reveal>
        <MomentsCarousel />
      </Reveal>

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <FaqSection />
      </Reveal>

      <Reveal>
        <ArticleListSection />
      </Reveal>

      <SiteFooter settings={settings} />
    </main>
  );
}
