import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/** "SwillFam in the Spotlight" — press/media mentions teaser linking to the /media-mentions page. */
export function SwillfamSpotlightSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          SwillFam in the Spotlight
        </h2>
        <div className="flex flex-col gap-8 justify-center">
          <p className="font-inter leading-relaxed text-white">
            Explore selected media features, press mentions, and editorial coverage about SwillFam
            and our venues. From lifestyle stories and nightlife highlights to event coverage and
            venue features, these mentions capture how SwillFam continues to shape Jakarta&apos;s
            food, drink, music, and entertainment scene.
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
