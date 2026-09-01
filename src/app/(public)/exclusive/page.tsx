import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ExclusiveSection } from "@/components/exclusive";
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
    <StickyHero
      backdrop={
          <Image src="/gallery/banner.png" alt="" fill className="object-cover" priority />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end gap-4 pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Stories, Moments, and First Looks
          </h1>
          <p className="max-w-2xl font-inter text-base leading-relaxed text-white md:text-lg">
            A closer look at what happens beyond the room, behind-the-scenes moments, first looks
            at what&apos;s coming next, and stories from across every SwillFam venue you
            won&apos;t find anywhere else.
          </p>
        </Container>
      }
    >
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
    </StickyHero>
  );
}
