import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ExclusiveHero, ExclusiveSection } from "@/components/exclusive";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { getArticleRows } from "@/lib/articles";

// Statically rendered but data-driven (articles) — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Exclusive | SwillFam",
  description:
    "Stories, moments, and first looks from across the SwillFam family of venues — a curated gallery of celebrations, events, and nightlife.",
};

export default async function ExclusivePage() {
  const [articles, editorialArticles] = await Promise.all([
    getArticleRows(3),
    getArticleRows(6),
  ]);

  return (
    <>
      <ExclusiveHero />

      <Reveal>
        <ExclusiveSection editorialArticles={editorialArticles} />
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
