import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/** "SwillFam in the Spotlight" — press/media mentions teaser linking to the /media-mentions page. */
export function SwillfamSpotlightSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          Where We&apos;ve Been Featured
        </h2>
        <div className="flex flex-col gap-8 justify-center">
          <p className="font-inter leading-relaxed">
            Take a look at the media mentions SwillFam has picked up across the city. Standout
            openings, talked-about nights, and the moments that got people paying attention.
          </p>
          <div>
            <SpecularButton href="/media-mentions" size="lg" radius={30}>
              See All Mentions
            </SpecularButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
