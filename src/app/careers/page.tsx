import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CareersHero, BePartSection, JobListings, ApplyNowSection } from "@/components/careers";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";

export const metadata: Metadata = {
  title: "Careers | SwillFam",
  description:
    "Explore open roles across SwillFam venues and join a team that brings the city's best lifestyle and nightlife experiences to life.",
};

export default async function CareersPage() {
  const [careers, settings] = await Promise.all([
    prisma.career.findMany({ select: { id: true, jobTitle: true }, orderBy: { createdAt: "desc" } }),
    getSiteSettings(),
  ]);

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <CareersHero />
      </div>

      <Reveal>
        <BePartSection />
      </Reveal>

      <Reveal>
        <JobListings />
      </Reveal>

      <Reveal>
        <ApplyNowSection careers={careers} />
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
