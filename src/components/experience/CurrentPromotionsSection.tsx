import { Container } from "@/components/shared/Container";
import { OfferCard, type OfferCardData } from "@/components/shared/OfferCard";

/** "Current Promotions" — centered heading + 3-col promo cards. Caller omits this section entirely when `promotions` is empty. */
export function CurrentPromotionsSection({ promotions }: { promotions: OfferCardData[] }) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        <div className="mx-auto flex max-w-[640px] flex-col gap-4 text-center">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            Current Promotions
          </h2>
          <p className="font-inter leading-relaxed text-white">
            Make your next SwillFam visit even better with active promotions across our venues.
            Explore selected offers for food, drinks, ladies night, group packages, table deals, and
            seasonal specials.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {promotions.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </Container>
    </section>
  );
}
