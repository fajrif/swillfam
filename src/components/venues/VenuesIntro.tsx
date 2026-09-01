import { Container } from "@/components/shared/Container";

/** Intro heading + lead under the venues hero. */
export function VenuesIntro() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            The Standard for Every Night Out
          </h2>
          <div className="flex flex-col justify-center">
            <p className="whitespace-pre-line font-inter leading-relaxed">
              {`Jakarta has no shortage of places to eat, drink, and gather, but not every space is built the same. SwillFam started with a simple idea: that a venue should be intentional. Every concept, from the menu to the music to the way a room is lit, is shaped around a specific mood and a specific kind of guest.

That's why no two SwillFam venues feel alike. Some are built for slow conversations over good food, others for nights that build momentum as they go. Whichever door you walk through, you're stepping into a space that was designed on purpose, for people who notice the difference.`}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
