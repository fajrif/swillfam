import { Container } from "@/components/shared/Container";

/** Intro heading + lead under the venues hero. */
export function VenuesIntro() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            Discover What&apos;s Happening Next
          </h2>
          <div className="flex flex-col justify-center">
            <p className="whitespace-pre-line font-inter leading-relaxed text-white">
              Explore the full collection of SwillFam venues across the city — from lifestyle restaurants
              and cafes to nightlife bars and clubs. Browse by category, find each destination on the map,
              and discover where to go next for your meal, night out, or celebration.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
