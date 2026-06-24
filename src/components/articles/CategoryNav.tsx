import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArticleCategory } from "@/generated/prisma/client";

/** Left-rail category list. "All Journals" + every real ArticleCategory; `scroll={false}` keeps the
 * page position fixed across the server-driven navigation instead of jumping back to the top. */
export function CategoryNav({
  categories,
  activeCategoryId,
}: {
  categories: ArticleCategory[];
  activeCategoryId?: string;
}) {
  return (
    <nav className="flex flex-col gap-3">
      <Link
        href="/articles"
        scroll={false}
        className={cn(
          "font-syne text-2xl uppercase leading-tight transition-colors lg:text-[28px]",
          !activeCategoryId ? "text-white" : "text-white/40 hover:text-white",
        )}
      >
        All Journals
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/articles?category=${category.id}`}
          scroll={false}
          className={cn(
            "font-syne text-2xl uppercase leading-tight transition-colors lg:text-[28px]",
            activeCategoryId === category.id ? "text-white" : "text-white/40 hover:text-white",
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
