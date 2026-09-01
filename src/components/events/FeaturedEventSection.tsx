import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/** Placeholder used until a featured event has its own artwork uploaded. */
const FALLBACK_IMAGE = "/events/sample-featured-events.png";

export type FeaturedEventData = {
  slug: string;
  name: string;
  image: string | null;
  venueName: string | null;
  shortDescription: string;
  /** Pre-formatted on the server — "15 August 2025" or "Every Fri, Sat". */
  dateLabel: string;
  /** Pre-formatted on the server — "8:00 PM – Late". */
  timeLabel: string;
};

/**
 * "Featured Events" — one large card for the newest featured event: artwork on
 * the left, schedule and blurb on the right. Renders nothing when no event is
 * flagged featured.
 */
export function FeaturedEventSection({ event }: { event: FeaturedEventData | null }) {
  if (!event) return null;

  return (
    <section className="py-16 lg:py-20">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
            Featured Events
          </h2>
          <p className="font-inter leading-relaxed">
            A closer look at the nights currently taking center stage across every SwillFam venue.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_4fr] lg:gap-12">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-sf-surface">
            <Image
              src={event.image ?? FALLBACK_IMAGE}
              alt={event.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-5">
            <h3 className="font-syne text-[clamp(1.75rem,3vw,36px)] font-bold leading-tight text-white">
              {event.name}
            </h3>

            <div className="flex flex-col gap-1 font-syne text-lg font-bold leading-snug text-white">
              {event.venueName && <span>{event.venueName}</span>}
              <span>{event.dateLabel}</span>
              <span>{event.timeLabel}</span>
            </div>

            <p className="font-inter leading-relaxed">{event.shortDescription}</p>

            <SpecularButton href={`/events/${event.slug}`} size="lg" radius={30} className="w-fit">
              See Event
            </SpecularButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
