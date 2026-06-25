import Image from "next/image";
import Link from "next/link";
import type { Category, Venue } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const FALLBACK = "/home/hero.png";

/**
 * "Explore Our {Name} Venues" — responsive 2-column grid of venue tiles.
 * Card mechanic mirrors `private-events/EventTypesSection`: the venue logo sits
 * centered over the image, and a transparent-black inset box reveals the venue
 * name + description on hover. Each card links to the venue detail page.
 */
export function VenuesGrid({ category }: { category: Category & { venues: Venue[] } }) {
  const { venues } = category;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-12">
        <SectionHeading title={`Explore Our ${category.name} Venues`} align="center" />

        {venues.length === 0 ? (
          <p className="text-center font-inter text-white">No venues in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="group relative block aspect-square w-full overflow-hidden border border-sf-border/40"
    >
      <Image
        src={venue.image ?? FALLBACK}
        alt={venue.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Subtle constant overlay so the centered logo stays legible */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Logo — centered, hidden on hover */}
      <div className="absolute inset-0 flex items-center justify-center p-10 transition-opacity duration-300 group-hover:opacity-0">
        {venue.logo ? (
          <div className="relative h-24 w-[58%] lg:h-32">
            <Image src={venue.logo} alt={venue.name} fill className="object-contain" />
          </div>
        ) : (
          <span className="text-center font-syne text-[clamp(1.5rem,2.5vw,32px)] font-bold leading-tight text-white">
            {venue.name}
          </span>
        )}
      </div>

      {/* Hover overlay: dark wash + inset bordered box, name (top) / logo (middle) / description (bottom) */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-5 flex flex-col items-center justify-between gap-6 border border-white/15 bg-black/75 px-8 py-12 text-center">
          <h3 className="font-syne text-[clamp(1.5rem,2.5vw,32px)] font-bold leading-tight text-white">
            {venue.name}
          </h3>
          {venue.logo ? (
            <div className="relative h-20 w-[55%] lg:h-24">
              <Image src={venue.logo} alt="" fill className="object-contain" />
            </div>
          ) : null}
          <p className="font-inter text-sm leading-relaxed text-white lg:text-base">
            {venue.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
