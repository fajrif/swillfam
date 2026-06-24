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
import { getArticleRows } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Careers | SwillFam",
  description:
    "Explore open roles across SwillFam venues and join a team that brings the city's best lifestyle and nightlife experiences to life.",
};

export default async function CareersPage() {
  const [careers, settings, articles] = await Promise.all([
    prisma.career.findMany({ orderBy: { createdAt: "desc" } }),
    getSiteSettings(),
    getArticleRows(3),
  ]);

  const applyNowCareers = careers.map(({ id, jobTitle }) => ({ id, jobTitle }));

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
        <JobListings careers={careers} />
      </Reveal>

      <Reveal>
        <ApplyNowSection careers={applyNowCareers} />
      </Reveal>

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>

      <SiteFooter settings={settings} />
    </main>
  );
}
