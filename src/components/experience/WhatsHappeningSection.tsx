import { Container } from "@/components/shared/Container";
import { OfferCard, type OfferCardData } from "@/components/shared/OfferCard";
import { EVENTS } from "./data";

const offers: OfferCardData[] = EVENTS.map((event, i) => ({
  id: String(i),
  image: event.img,
  title: event.name,
  description: event.description,
  venueName: event.venue,
  venueLogo: null,
  meta: event.date,
}));

/** "What's Happening This Week" — centered heading + 3-col event cards. */
export function WhatsHappeningSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        <div className="mx-auto flex max-w-[640px] flex-col gap-4 text-center">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            What&apos;s Happening This Week
          </h2>
          <p className="font-inter leading-relaxed text-white">
            Explore upcoming events across SwillFam venues and see what is happening this week. From
            dining experiences and regular programs to music nights and special events, there is
            always something to discover.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </Container>
    </section>
  );
}
