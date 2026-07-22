import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

/**
 * Shared band used on /promotions and /talents: left "Destinations with Distinct
 * Personalities" (reproduced from StandForColumnsSection) + right "Explore Events" column.
 */
export function DestinationsFeatureBand() {
  return (
    <section className="pt-16">
      <Container>
        <div className="grid border border-sf-border/40 lg:grid-cols-[8fr_4fr]">
          {/* Destinations */}
          <div className="flex flex-col gap-8 border-b border-sf-border/40 p-4 sm:flex-row lg:border-b-0">
            <div className="relative aspect-[382/522] w-full shrink-0 overflow-hidden sm:w-[340px]">
              <Image
                src="/about/personalities.png"
                alt="SwillFam destinations"
                fill
                sizes="(max-width: 768px) 100vw, 340px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-4">
              <div className="flex flex-col gap-4">
                <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                  Destinations with Distinct Personalities
                </h3>
                <p className="font-inter leading-relaxed text-white">
                  Every SwillFam venue has its own concept and atmosphere. From dining and social
                  spaces to nightlife and events, each offers a unique experience while reflecting
                  the SwillFam identity. Our venues are designed to bring people together and create
                  memorable moments.
                </p>
              </div>
              <Button asChild variant="swillfam" size="pill" className="w-fit">
                <Link href="/venues">Explore Venues</Link>
              </Button>
            </div>
          </div>

          {/* Explore Events */}
          <div className="flex flex-col justify-between gap-4 p-4 lg:border-l lg:border-sf-border/40">
            <div className="flex flex-col gap-4">
              <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                Explore Events
              </h3>
              <p className="font-inter leading-relaxed text-white">
                Explore upcoming lifestyle and nightlife events happening across SwillFam venues,
                from relaxed gatherings and social meetups to high-energy nights, live
                entertainment, and special experiences designed to bring people together.
              </p>
            </div>
            <Button asChild variant="swillfam" size="pill" className="w-fit">
              <Link href="/events">View Events</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
