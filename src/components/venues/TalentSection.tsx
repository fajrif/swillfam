import Link from "next/link";
import type { Talent } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContentImage } from "@/components/shared/ContentImage";

const FALLBACK = "/home/hero.png";

/** Trims an Instagram profile URL down to its "@handle". */
function getInstagramHandle(url: string): string | null {
  try {
    const handle = new URL(url).pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle}` : null;
  } catch {
    return null;
  }
}

/** "Meet our Talents" — responsive grid of talent cards. */
export function TalentSection({
  talents,
  title = "Meet Our Talents",
  description,
}: {
  talents: Talent[];
  title?: string;
  description?: string;
}) {
  if (talents.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-12">
        <SectionHeading title={title} lead={description} align="center" />

        {/* Every card is one third of the row (half on tablet) whatever the count,
            so a venue with two talents gets the same card as one with three; the
            leftovers centre. Sizing the grid by count made two cards much smaller. */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {talents.map((talent) => {
            const instagramHandle = talent.instagramUrl
              ? getInstagramHandle(talent.instagramUrl)
              : null;

            return (
              <div
                key={talent.id}
                className="group flex w-full flex-col gap-4 border border-sf-border/40 bg-sf-surface/20 p-4 sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
              >
                <Link
                  href={`/talents/${talent.slug}`}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-sf-surface"
                >
                  <ContentImage
                    src={talent.image ?? FALLBACK}
                    alt={talent.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link href={`/talents/${talent.slug}`}>
                      <h3 className="font-syne text-xl font-bold leading-tight text-white transition-colors group-hover:text-sf-accent">
                        {talent.name}
                      </h3>
                    </Link>
                    {talent.instagramUrl && instagramHandle ? (
                      <a
                        href={talent.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 font-inter text-sm text-white transition-colors hover:text-sf-accent"
                      >
                        {instagramHandle}
                      </a>
                    ) : null}
                  </div>
                  <p className="font-archivo text-xs uppercase tracking-[0.14em] text-white">
                    {talent.speciality}
                  </p>
                  <p className="font-inter text-sm leading-relaxed">
                    {talent.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
