import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { CategoryNav } from "./CategoryNav";
import type { ArticleRow } from "@/components/shared/ArticleListSection";
import type { ArticleCategory } from "@/generated/prisma/client";

/** Category nav (left) + article feed (right). Category/page state is server-driven via searchParams. */
export function ArticlesBrowser({
  categories,
  activeCategoryId,
  articles,
  hasMore,
  loadMoreHref,
}: {
  categories: ArticleCategory[];
  activeCategoryId?: string;
  articles: ArticleRow[];
  hasMore: boolean;
  loadMoreHref: string;
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr]">
        <CategoryNav categories={categories} activeCategoryId={activeCategoryId} />

        <div className="flex flex-col gap-10">
          {/* Keyed by category so switching category remounts the list and
              replays the fade-up entrance; Load More (same category, more
              items) keeps this key, so only newly-appended cards animate in. */}
          <div key={activeCategoryId ?? "all"} className="flex flex-col gap-4">
            {articles.map((article, i) => (
              <Link
                key={i}
                href={article.href ?? "#"}
                className="group flex flex-col gap-4 border border-sf-border/50 transition-colors duration-300 hover:border-white/80 animate-fade-up sm:flex-row"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <div className="relative w-full shrink-0 overflow-hidden bg-sf-surface aspect-video sm:aspect-auto sm:w-[140px] lg:w-[200px] sm:h-full">
                  <Image
                    src={article.img}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <span className="font-inter text-xs text-white/50">{article.date}</span>
                  <h3 className="font-syne text-xl leading-snug text-white transition-colors duration-300 group-hover:text-sf-accent lg:text-2xl">
                    {article.title}
                  </h3>
                  <p className="line-clamp-3 font-inter text-sm leading-relaxed text-white">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <SpecularButton href={loadMoreHref} scroll={false} size="lg" radius={30} className="mx-auto w-fit">
                Load More
              </SpecularButton>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
