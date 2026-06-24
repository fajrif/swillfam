import { prisma } from "@/lib/prisma";
import type { ArticleRow } from "@/components/shared/ArticleListSection";

const DATE_FMT = new Intl.DateTimeFormat("en-GB");

/** Most recent published articles, mapped to the shape `ArticleListSection` expects. */
export async function getArticleRows(limit: number): Promise<ArticleRow[]> {
  const articles = await prisma.article.findMany({
    where: { status: 1 },
    orderBy: { publishedDate: "desc" },
    take: limit,
  });

  return articles.map((a) => ({
    img: a.image ?? "/articles/sample-banner.png",
    date: DATE_FMT.format(a.publishedDate),
    title: a.title,
    excerpt: a.shortDescription,
    href: `/articles/${a.slug}`,
  }));
}
