import Link from "next/link";
import { Container } from "@/components/shared/Container";

/**
 * "Back to Private Events" + the two-column opener: the private event's caption
 * as the heading on the left, its description beside it on the right.
 *
 * `description` is a plain textarea in admin, so blank lines become paragraphs.
 */
export function PrivateEventIntro({
  caption,
  description,
}: {
  caption: string;
  description: string;
}) {
  const paragraphs = description.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  return (
    <section className="py-12 lg:py-16">
      <Container className="flex flex-col gap-10 lg:gap-12">
        <Link
          href="/private-events"
          className="group inline-flex w-fit items-center gap-3 font-inter text-sm uppercase tracking-[0.06em] text-white"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Back to Private Events
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            {caption}
          </h2>
          <div className="flex flex-col justify-center gap-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="font-inter leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
