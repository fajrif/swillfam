import { ArticleListSection } from "@/components/shared/ArticleListSection";

/** EDITORIAL tab — the guides/journal list, expanded to 6 entries. */
export function EditorialList() {
  return <ArticleListSection limit={6} ctaHref="/exclusive" />;
}
