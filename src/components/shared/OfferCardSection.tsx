import { Container } from "@/components/shared/Container";
import { OfferCard, type OfferCardData } from "@/components/shared/OfferCard";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/**
 * Centered heading + optional lead + a 3-col grid of OfferCards, with an
 * optional CTA button below. Shared by the promotion/talent/event detail
 * pages for "Other Promotions", "More Talent", and "Upcoming Events" rows, as
 * well as the home/experience/venue "Upcoming Events" and "What's Happening"
 * sections. Callers omit the section entirely when `offers` is empty.
 */
export function OfferCardSection({
  title,
  lead,
  offers,
  ctaText,
  ctaHref,
}: {
  title: string;
  lead?: string;
  offers: OfferCardData[];
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12 items-center">
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
            <div key={offer.id} className="w-full max-w-sm">
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>

        {ctaText && ctaHref ? (
          <SpecularButton href={ctaHref} size="lg" radius={30} className="mx-auto w-fit">
            {ctaText}
          </SpecularButton>
        ) : null}
      </Container>
    </section>
  );
}
