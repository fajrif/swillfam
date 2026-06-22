import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";

const ARTICLES = [
  { img: "/home/guide-1.jpg", date: "22/06/2026" },
  { img: "/home/guide-2.jpg", date: "22/06/2026" },
  { img: "/home/guide-3.jpg", date: "22/06/2026" },
];

/** Guides & Journals (Figma 441:81) — left intro column + right article list. */
export function GuidesJournals() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex max-w-[560px] flex-col gap-6">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-sf-text">
            Guides &amp; Journals
          </h2>
          <p className="font-inter text-base leading-relaxed text-white/70 md:text-lg">
            Discover stories, recommendations, and insider guides from the SwillFam world. From where
            to go this weekend to what to try, what to book, and what not to miss, our guides help you
            experience the best of our venues.
          </p>
          <Button asChild variant="pill" size="pill" className="w-fit">
            <Link href="#">See all guides</Link>
          </Button>
        </div>

        <div className="flex flex-col">
          {ARTICLES.map((article, i) => (
            <Link
              key={i}
              href="#"
              className="group flex gap-5 border-b border-sf-border/50 py-5 first:pt-0"
            >
              <div className="relative size-[120px] shrink-0 overflow-hidden bg-sf-surface sm:size-[140px]">
                <Image
                  src={article.img}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-inter text-xs text-white/50">{article.date}</span>
                <h3 className="font-syne text-xl leading-snug text-white lg:text-[28px]">
                  Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna
                </h3>
                <p className="line-clamp-2 font-inter text-sm leading-relaxed text-white/70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
