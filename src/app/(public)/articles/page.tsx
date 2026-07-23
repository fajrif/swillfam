import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { ArticlesHero, ArticlesBrowser } from "@/components/articles";
import type { ArticleRow } from "@/components/shared/ArticleListSection";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";

export const metadata: Metadata = {
  title: "Articles & Journals | SwillFam",
  description:
    "Stories, recommendations, and insider guides from the SwillFam world — nightlife, lifestyle, talents, and the people who make every night memorable.",
};

const DATE_FMT = new Intl.DateTimeFormat("en-GB");
const PAGE_SIZE = 9;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = {
    status: 1,
    ...(category ? { articleCategoryId: category } : {}),
  };

  const [categories, articles, total] = await Promise.all([
    prisma.articleCategory.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.article.findMany({
      where,
      orderBy: { publishedDate: "desc" },
      take: PAGE_SIZE * page,
    }),
    prisma.article.count({ where }),
  ]);

  const articleRows: ArticleRow[] = articles.map((a) => ({
    img: a.image ?? "/articles/sample-banner.png",
    date: DATE_FMT.format(a.publishedDate),
    title: a.title,
    excerpt: a.shortDescription,
    href: `/articles/${a.slug}`,
  }));

  const hasMore = articles.length < total;
  const loadMoreHref = `/articles?${new URLSearchParams({
    ...(category ? { category } : {}),
    page: String(page + 1),
  }).toString()}`;

  return (
    <>
      <ArticlesHero />

      <Reveal>
        <ArticlesBrowser
          categories={categories}
          activeCategoryId={category}
          articles={articleRows}
          hasMore={hasMore}
          loadMoreHref={loadMoreHref}
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
