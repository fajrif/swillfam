import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { ExploreCategory } from "@/components/home/ExploreCategory";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { Experience } from "@/components/home/Experience";
import { TrustedCrowd } from "@/components/home/TrustedCrowd";
import { GuidesJournals } from "@/components/home/GuidesJournals";
import { ExclusiveRecap } from "@/components/home/ExclusiveRecap";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "SwillFam — Discover the City's Best Lifestyle & Nightlife Experiences",
  description:
    "SwillFam connects people with the city's best venues, events, and stories — from casual nights out to curated social experiences and exclusive gatherings.",
};

export default function Home() {
  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <Hero />
      </div>
      <Reveal>
        <ExploreCategory />
      </Reveal>
      <Reveal>
        <UpcomingEvents />
      </Reveal>
      <Reveal>
        <Experience />
      </Reveal>
      <Reveal>
        <TrustedCrowd />
      </Reveal>
      <Reveal>
        <GuidesJournals />
      </Reveal>
      <Reveal>
        <ExclusiveRecap />
      </Reveal>
      <SiteFooter />
    </main>
  );
}
