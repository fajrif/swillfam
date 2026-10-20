import { prisma } from "@/lib/prisma";
import { getImageAlts } from "@/lib/image-alt";
import type { ArticleRow } from "@/components/shared/ArticleListSection";

const DATE_FMT = new Intl.DateTimeFormat("en-GB");

/** Most recent published articles, mapped to the shape `ArticleListSection` expects. */
export async function getArticleRows(limit: number): Promise<ArticleRow[]> {
  const [articles, alts] = await Promise.all([
    prisma.article.findMany({
      where: { status: 1 },
      orderBy: { publishedDate: "desc" },
      take: limit,
    }),
    getImageAlts(),
  ]);

  return articles.map((a) => {
    const img = a.image ?? "/articles/sample-banner.png";
    return {
    img,
    // "" when nothing is written: the title is adjacent, so the cover is
    // decorative until someone describes the picture itself.
    alt: alts.get(img)?.trim() ?? "",
    date: DATE_FMT.format(a.publishedDate),
    title: a.title,
    excerpt: a.shortDescription,
    href: `/guides/${a.slug}`,
    };
  });
}
