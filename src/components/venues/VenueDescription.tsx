import { Container } from "@/components/shared/Container";
import type { Venue } from "@/generated/prisma/client";

export function VenueDescription({ venue }: { venue: Venue }) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            {venue.caption}
          </h2>
          <div className="flex flex-col justify-center">
            <p className="whitespace-pre-line font-inter leading-relaxed text-white">
              {venue.description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
