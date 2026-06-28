import Image from "next/image";
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {talents.map((talent) => (
            <div key={talent.id} className="flex flex-col gap-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-sf-border/40 bg-sf-surface">
                <Image
                  src={talent.image ?? FALLBACK}
                  alt={talent.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-syne text-xl font-bold leading-tight text-white">
                    {talent.name}
                  </h3>
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
