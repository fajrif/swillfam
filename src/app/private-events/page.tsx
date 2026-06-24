import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
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
import { getArticleRows } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Private Events | SwillFam",
  description:
    "Host corporate functions, birthdays, brand activations, and celebrations across SwillFam's distinctive venues — events designed around your vision.",
};

export default async function PrivateEventsPage() {
  const [settings, faqs, articles] = await Promise.all([
    getSiteSettings(),
    prisma.faq.findMany({
      where: { published: true, segment: "private_events" },
      orderBy: { sortOrder: "asc" },
    }),
    getArticleRows(3),
  ]);

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
        <FaqSection faqs={faqs} />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>

      <SiteFooter settings={settings} />
    </main>
  );
}
