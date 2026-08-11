import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { DestinationsColumn } from "@/components/shared/DestinationsColumn";

/**
 * Shared band used on /promotions and /talents: left "Destinations with Distinct
 * Personalities" (reproduced from StandForColumnsSection) + a configurable right column.
 * The right column defaults to "Explore Events"; the promotion pages override it to
 * "Explore Promotions".
 */
export function DestinationsFeatureBand({
  rightTitle = "Explore Events",
  rightBody = "Explore upcoming lifestyle and nightlife events happening across SwillFam venues, from relaxed gatherings and social meetups to high-energy nights, live entertainment, and special experiences designed to bring people together.",
  rightCtaLabel = "View Events",
  rightCtaHref = "/events",
}: {
  rightTitle?: string;
  rightBody?: string;
  rightCtaLabel?: string;
  rightCtaHref?: string;
} = {}) {
  return (
    <section className="pt-16">
      <Container>
        <div className="grid border border-sf-border/40 lg:grid-cols-[8fr_4fr]">
          <DestinationsColumn />

          {/* Right column (Explore Events by default; Explore Promotions on promo pages) */}
          <div className="flex flex-col justify-between gap-4 p-4 lg:border-l lg:border-sf-border/40">
            <div className="flex flex-col gap-4">
              <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                {rightTitle}
              </h3>
              <p className="font-inter leading-relaxed">{rightBody}</p>
            </div>
            <SpecularButton href={rightCtaHref} size="lg" radius={30} className="w-fit">
              {rightCtaLabel}
            </SpecularButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
