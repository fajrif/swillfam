import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { ArticleHero, ArticleContent } from "@/components/articles";
import { ArticleListSection, type ArticleRow } from "@/components/shared/ArticleListSection";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";

const DATE_FMT = new Intl.DateTimeFormat("en-GB");

/** Cached so generateMetadata and the page share a single DB read per request. */
const getArticleBySlug = cache((slug: string) =>
  prisma.article.findUnique({ where: { slug }, include: { articleCategory: true } }),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article | SwillFam" };
  return {
    title: `${article.title} | SwillFam`,
    description: article.shortDescription,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== 1) notFound();

  const others = await prisma.article.findMany({
    where: { status: 1, slug: { not: slug } },
    orderBy: { publishedDate: "desc" },
    take: 3,
  });

  const otherRows: ArticleRow[] = others.map((a) => ({
    img: a.image ?? "/articles/sample-banner.png",
    date: DATE_FMT.format(a.publishedDate),
    title: a.title,
    excerpt: a.shortDescription,
    href: `/articles/${a.slug}`,
  }));

  return (
    <>
      <ArticleHero title={article.title} image={article.image} />

      <ArticleContent
        title={article.title}
        publishedDate={article.publishedDate}
        shortDescription={article.shortDescription}
        description={article.description}
      />

      <Reveal>
        <ArticleListSection
          title="Other Articles"
          lead="Continue exploring stories, recommendations, and insider guides from the SwillFam world."
          articles={otherRows}
          ctaLabel="See All Articles"
          ctaHref="/articles"
        />
      </Reveal>

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>
    </>
  );
}
