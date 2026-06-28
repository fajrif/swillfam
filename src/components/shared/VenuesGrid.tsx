import type { Category, Venue } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VenueCard } from "@/components/shared/VenueCard";

/**
 * "Explore Our {Name} Venues" — responsive 2-column grid of venue tiles.
 * Each card links to the venue detail page (see {@link VenueCard}).
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
