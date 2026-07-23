import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
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
        <ParallaxImage>
          <Image src="/gallery/banner.png" alt="" fill className="object-cover" priority />
        </ParallaxImage>
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Stories, Moments, and First Looks
          </h1>
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
