import Link from "next/link";
import type { Category } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";

/**
 * Back link + two-column intro: headline (left), long description (right).
 * Figma category 558:230 / 558:228 / 558:229.
 */
export function CategoryIntro({ category }: { category: Category }) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-10">
        <Link
          href="/venues"
          className="group inline-flex w-fit items-center gap-3 font-inter text-sm uppercase tracking-[0.06em] text-white"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Back to Venues Archive
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            {category.headline ?? category.name}
          </h2>
          <div className="flex flex-col justify-center">
            <p className="whitespace-pre-line font-inter leading-relaxed text-white">
              {category.description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
