import type { Venue } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VenueCard } from "@/components/shared/VenueCard";

/**
 * "Recommended Venues for …" — the venues linked to this private event, as the
 * same square logo tiles used elsewhere, in the mockup's two-column grid.
 */
export function RecommendedVenuesSection({
  title,
  lead,
  venues,
}: {
  title: string;
  lead?: string;
  venues: Venue[];
}) {
  if (venues.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-12">
        <SectionHeading align="center" title={title} lead={lead} />

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} disableHoverOverlay />
          ))}
        </div>
      </Container>
    </section>
  );
}
