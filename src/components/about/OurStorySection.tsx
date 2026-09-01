import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { ParallaxImage } from "@/components/shared/ParallaxImage";

export function OurStorySection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        {/* Row 1: eyebrow + heading */}
        <div className="flex flex-col gap-2">
          <p className="font-inter text-lg font-thin text-white">Our Story</p>
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white mr-2">
            More Than a Hospitality Group
          </h2>
        </div>

        {/* Row 2: image + story text, "Not simply..." aligned to the image top */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[683/547] w-full overflow-hidden border border-sf-border/30">
            <ParallaxImage>
              <Image
                src="/about/our-story.png"
                alt="A SwillFam venue at night"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </ParallaxImage>
          </div>

          <div className="flex flex-col gap-6 font-inter">
            <p className="font-syne text-[clamp(1.75rem,3vw,40px)] font-semibold leading-tight italic">
              Not simply venues.
              <br />
              Not simply events.
            </p>
            <p className="leading-relaxed">
              Every SwillFam venue started the same way, with a gap we noticed in Jakarta&apos;s
              dining and nightlife scene. Too many spaces felt interchangeable, built to a formula
              rather than a feeling. So we set out to do it differently, treating each new concept as
              its own world, shaped by its own music, menu, and mood, rather than a copy-paste of what
              came before.
            </p>
            <p className="leading-relaxed">
              That approach took us from a single hip-hop bar to a growing group of restaurants,
              cocktail bars, and clubs across Jakarta, each with a distinct identity but the same
              underlying standard: nothing generic, nothing half-considered. Chefs, bartenders, and
              designers were given room to push their own ideas, which is why no two SwillFam spaces
              look or feel alike.
            </p>
            <p className="leading-relaxed">
              What hasn&apos;t changed is the reason people keep returning, spaces that feel made for
              them, in a city that never runs out of reasons to go out.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
