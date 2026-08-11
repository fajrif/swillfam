import Image from "next/image";
import type { Venue } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/** "Performing at <Venue>" — venue blurb + CTA (left) and venue image (right),
 *  boxed like CareersSection. Caller only renders this when the talent has a home venue. */
export function TalentPerformingSection({ venue }: { venue: Venue }) {
  const image = venue.image ?? venue.bannerImage;

  return (
    <section className="pt-8 pb-16">
      <Container>
        <div className="grid gap-8 border border-sf-border/40 p-4 lg:grid-cols-[7fr_5fr]">
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
                Performing at {venue.name}
              </h2>
              <p className="whitespace-pre-line font-inter leading-relaxed">
                {venue.shortDescription ?? venue.description}
              </p>
            </div>
            <SpecularButton href={`/venues/${venue.slug}`} size="lg" radius={30} className="w-fit">
              Discover {venue.name}
            </SpecularButton>
          </div>

          <div className="relative aspect-square w-full overflow-hidden border border-sf-border/30">
            {image ? (
              <Image
                src={image}
                alt={venue.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-sf-surface" />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
