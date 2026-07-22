import { Container } from "@/components/shared/Container";
import { OfferCard, type OfferCardData } from "@/components/shared/OfferCard";

/**
 * Centered heading + optional lead + a 3-col grid of OfferCards. Shared by the
 * promotion/talent detail pages for "Other Promotions", "More Talent", and
 * "Upcoming Events" rows. Callers omit the section entirely when `offers` is empty.
 */
export function OfferCardSection({
  title,
  lead,
  offers,
}: {
  title: string;
  lead?: string;
  offers: OfferCardData[];
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        <div className="mx-auto flex max-w-[640px] flex-col gap-4 text-center">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            {title}
          </h2>
          {lead ? (
            <p className="font-inter leading-relaxed text-white">{lead}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="w-full md:w-[calc((100%-3rem)/3)]">
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
