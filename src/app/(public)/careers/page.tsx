import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { CareersHero, BePartSection, JobListings, ApplyNowSection } from "@/components/careers";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { getArticleRows } from "@/lib/articles";

// Statically rendered but data-driven (careers, articles) — revalidate periodically
// so admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers | SwillFam",
  description:
    "Explore open roles across SwillFam venues and join a team that brings the city's best lifestyle and nightlife experiences to life.",
};

export default async function CareersPage() {
  const [careers, articles] = await Promise.all([
    prisma.career.findMany({ orderBy: { createdAt: "desc" } }),
    getArticleRows(3),
  ]);

  const applyNowCareers = careers.map(({ id, jobTitle }) => ({ id, jobTitle }));

  return (
    <>
      <CareersHero />

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
    </>
  );
}
