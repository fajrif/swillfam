import type { Venue } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VenueCard } from "@/components/shared/VenueCard";

/** "See Other Venues" — sibling venues from the same category (max 2 supplied by the page). */
export function OtherVenuesSection({ venues }: { venues: Venue[] }) {
  if (venues.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-12">
        <SectionHeading title="See Other Venues" align="center" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </Container>
    </section>
  );
}
