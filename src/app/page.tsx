import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { DualImageColumnSection } from "@/components/shared/DualImageColumnSection";
import { EventSectionWithImage } from "@/components/shared/EventSectionWithImage";
import { Experience } from "@/components/home/Experience";
import { CardImageInfoSection } from "@/components/shared/CardImageInfoSection";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { ExclusiveRecap } from "@/components/home/ExclusiveRecap";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";

export const metadata: Metadata = {
  title: "SwillFam — Discover the City's Best Lifestyle & Nightlife Experiences",
  description:
    "SwillFam connects people with the city's best venues, events, and stories — from casual nights out to curated social experiences and exclusive gatherings.",
};

export default async function Home() {
  const [settings, articles] = await Promise.all([getSiteSettings(), getArticleRows(3)]);
  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <Hero />
      </div>
      <Reveal>
        <DualImageColumnSection
          tiles={[
            { src: "/home/category-lifestyle.png", label: "Lifestyle", labelAlign: "top-left", href: "/category/lifestyle" },
            { src: "/home/category-nightlife.png", label: "Nightlife", labelAlign: "bottom-right", href: "/category/nightlife" },
          ]}
        />
      </Reveal>
      <Reveal>
        <EventSectionWithImage
          title="Upcoming Events"
          description="Stay updated with upcoming events, special programs, parties, collaborations, and community gatherings happening across Swillfam's network."
          ctaText="See all events"
          ctaHref="/events"
          items={[
            { img: "/home/poster-1.png", title: "Mat & Mingle", shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
            { img: "/home/poster-2.png", title: "High Five", shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
            { img: "/home/poster-3.png", title: "Truce", shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          ]}
        />
      </Reveal>
      <Reveal>
        <Experience />
      </Reveal>
      <Reveal>
        <CardImageInfoSection />
      </Reveal>
      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
      <Reveal>
        <ExclusiveRecap />
      </Reveal>
      <SiteFooter settings={settings} />
    </main>
  );
}
