import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { cn } from "@/lib/utils";

export type ArticleRow = {
  img: string;
  date: string;
  title: string;
  excerpt: string;
  href?: string;
};

const DEFAULT_TITLE = "Guides & Journals";

const DEFAULT_LEAD =
  "Discover stories, recommendations, and insider guides from the SwillFam world. From where to go this weekend to what to try, what to book, and what not to miss, our guides help you experience the best of our venues.";

const DEFAULT_EXCERPT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.";

const DEFAULT_ARTICLES: ArticleRow[] = [
  { img: "/home/guide-1.jpg", date: "22/06/2026", title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna", excerpt: DEFAULT_EXCERPT },
  { img: "/home/guide-2.jpg", date: "22/06/2026", title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna", excerpt: DEFAULT_EXCERPT },
  { img: "/home/guide-3.jpg", date: "22/06/2026", title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna", excerpt: DEFAULT_EXCERPT },
  { img: "/home/guide-1.jpg", date: "22/06/2026", title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna", excerpt: DEFAULT_EXCERPT },
  { img: "/home/guide-2.jpg", date: "22/06/2026", title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna", excerpt: DEFAULT_EXCERPT },
  { img: "/home/guide-3.jpg", date: "22/06/2026", title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna", excerpt: DEFAULT_EXCERPT },
];

/**
 * Left intro column + right dated article list (Figma home 441:81).
 * Prop-driven so it can be reused — defaults reproduce the homepage "Guides &
 * Journals" section when rendered with no props. Pass `ctaLabel={null}` to hide
 * the button (e.g. the About "Press & Media" section has no CTA).
 */
export function ArticleListSection({
  title = DEFAULT_TITLE,
  lead = DEFAULT_LEAD,
  articles,
  limit = 3,
  ctaLabel = "See all guides",
  ctaHref = "/articles",
}: {
  title?: string;
  lead?: string;
  articles?: ArticleRow[];
  limit?: number;
  ctaLabel?: string | null;
  ctaHref?: string;
}) {
  const rows = articles ?? DEFAULT_ARTICLES.slice(0, limit);
  const isLongTitle = title.length > "Guides & Journals".length;
  return (
    <section className="py-16">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex max-w-[560px] flex-col gap-6">
          <h2
            className={cn(
              "font-syne leading-[1.05] text-sf-text",
              isLongTitle
                ? "text-[clamp(1.75rem,3.5vw,40px)]"
                : "text-[clamp(2.25rem,5vw,64px)]",
            )}
          >
            {title}
          </h2>
          <p className="font-inter text-base leading-relaxed text-white md:text-lg">{lead}</p>
          {ctaLabel ? (
            <SpecularButton href={ctaHref} size="lg" radius={30} className="w-fit">
              {ctaLabel}
            </SpecularButton>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((article, i) => (
            <Link key={i} href={article.href ?? "#"} className="group flex flex-col gap-2 border border-sf-border/50 transition-colors duration-300 hover:border-white/80 sm:flex-row">
              <div className="relative w-full shrink-0 overflow-hidden bg-sf-surface sm:w-[120px] lg:w-[140px] aspect-video sm:aspect-auto sm:h-full">
                <Image
                  src={article.img}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2 p-2">
                <span className="font-inter text-xs text-white/50">{article.date}</span>
                <h3 className="font-syne text-xl leading-snug text-white transition-colors duration-300 group-hover:text-sf-accent lg:text-[22px]">
                  {article.title}
                </h3>
                <p className="line-clamp-2 font-inter text-sm leading-relaxed text-white">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
