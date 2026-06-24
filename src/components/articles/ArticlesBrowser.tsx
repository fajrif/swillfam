import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { CategoryNav } from "./CategoryNav";
import { ARTICLES } from "./data";

/** Category nav (left) + article feed with a Load More button (right). */
export function ArticlesBrowser() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr]">
        <CategoryNav />

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            {ARTICLES.map((article, i) => (
              <Link
                key={i}
                href={article.href ?? "#"}
                className="group flex gap-4 border border-sf-border/50"
              >
                <div className="relative w-[140px] shrink-0 overflow-hidden bg-sf-surface sm:w-[200px]">
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
                  <h3 className="font-syne text-xl leading-snug text-white transition-colors group-hover:text-sf-accent lg:text-2xl">
                    {article.title}
                  </h3>
                  <p className="line-clamp-3 font-inter text-sm leading-relaxed text-white">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Button variant="swillfam" size="pill" className="mx-auto">
            Load More
          </Button>
        </div>
      </Container>
    </section>
  );
}
