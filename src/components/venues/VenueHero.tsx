import Image from "next/image";
import type { Category, Venue } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";

const FALLBACK = "/home/hero.png";

/** Full-bleed venue banner + eyebrow (category) / headline (name) / intro paragraph. */
export function VenueHero({ venue }: { venue: Venue & { category: Category | null } }) {
  return (
    <div className="relative h-[715px] w-full overflow-hidden">
      <Image
        src={venue.bannerImage ?? venue.image ?? FALLBACK}
        alt={venue.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-x-0 bottom-0 h-[320px] bg-gradient-to-t from-sf-bg to-transparent" />
      <Container className="relative z-10 flex h-full flex-col justify-end gap-4 pb-12">
        {venue.category ? (
          <span className="font-archivo text-sm uppercase tracking-[0.18em] text-white">
            {venue.category.name}
          </span>
        ) : null}
        <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
          {venue.name}
        </h1>
      </Container>
    </div>
  );
}
