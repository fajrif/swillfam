import { ArticleListSection, type ArticleRow } from "@/components/shared/ArticleListSection";

/** EDITORIAL tab — the guides/journal list, expanded to 6 entries. */
export function EditorialList({ articles }: { articles: ArticleRow[] }) {
  return <ArticleListSection articles={articles} ctaHref="/exclusive" />;
}
