import Image from "next/image";
import Link from "next/link";
import type { Talent } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const FALLBACK = "/home/hero.png";

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

        <div
          className={
            talents.length === 1
              ? "mx-auto grid max-w-sm grid-cols-1 gap-6 sm:gap-8"
              : talents.length === 2
                ? "mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
                : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          }
        >
          {talents.map((talent) => (
            <div key={talent.id} className="group flex flex-col gap-4">
              <Link
                href={`/talents/${talent.slug}`}
                className="relative aspect-[4/5] w-full overflow-hidden border border-sf-border/40 bg-sf-surface"
              >
                <Image
                  src={talent.image ?? FALLBACK}
                  alt={talent.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <Link href={`/talents/${talent.slug}`}>
                    <h3 className="font-syne text-xl font-bold leading-tight text-white transition-colors group-hover:text-sf-accent">
                      {talent.name}
                    </h3>
                  </Link>
                  {talent.instagramUrl ? (
                    <a
                      href={talent.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${talent.name} on Instagram`}
                      className="shrink-0 text-white transition-colors hover:text-sf-accent"
                    >
                      <i className="ph ph-instagram-logo text-2xl" aria-hidden />
                    </a>
                  ) : null}
                </div>
                <p className="font-archivo text-xs uppercase tracking-[0.14em] text-white">
                  {talent.speciality}
                </p>
                <p className="font-inter text-sm leading-relaxed text-white">
                  {talent.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
