import type { Venue } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VenueCard } from "@/components/shared/VenueCard";

/** "See Other Venues" — sibling venues from the same category (max 3 supplied by the page). */
export function OtherVenuesSection({ venues }: { venues: Venue[] }) {
  if (venues.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-12">
        <SectionHeading title="See Other Venues" align="center" />

        <div className="flex flex-wrap justify-center gap-6">
          {venues.map((venue) => (
            <div key={venue.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]">
              <VenueCard venue={venue} disableHoverOverlay />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
