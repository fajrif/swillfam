import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/** Intro: eyebrow + title (left) + body paragraphs + CTA (right). */
export function VisionSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="font-inter text-lg font-thin text-white">Philosophy &amp; Experience</p>
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            Host it with SwillFam
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-inter leading-relaxed">
            SwillFam is home to some of Jakarta&apos;s most versatile private event venues, each one
            built to fit the occasion. Planning a birthday party? Our birthday party venues range
            from intimate rooms to full-scale takeovers, giving every celebration its own character.
            For a graduation party, a private party, or simply a night to mark a milestone, our
            venues offer the flexibility to shape the space around your guest list and vibe.
          </p>
          <p className="font-inter leading-relaxed">
            On the corporate side, SwillFam venues double as reliable spaces for corporate events,
            office parties, and everything in between, from client dinners to full-scale corporate
            parties. And for couples looking to keep the celebration going, our spaces make for one
            of the city&apos;s most sought-after settings for a wedding after party, giving guests a
            reason to stay out long after the reception ends.
          </p>
          <p className="font-inter leading-relaxed">
            Whatever the occasion, SwillFam offers a private event venue built to match the moment.
          </p>
          <SpecularButton href="/venues" size="lg" radius={30} className="w-fit">
            View All Venues
          </SpecularButton>
        </div>
      </Container>
    </section>
  );
}
