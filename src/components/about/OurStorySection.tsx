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
            One Family, Many Rooms
          </h2>
        </div>

        {/* Row 2: image + story text, lead line aligned to the image top */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Portrait source (2:3) — 4:5 keeps it close to uncropped. */}
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-sf-border/30">
            <ParallaxImage>
              <Image
                src="/about/one-family-many-rooms.webp"
                alt="Guests raising shots together across a SwillFam bar"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </ParallaxImage>
          </div>

          <div className="flex flex-col gap-6 font-inter">
            <p className="font-syne text-[clamp(1.75rem,3vw,40px)] font-semibold leading-tight italic">
              It all started from a hip-hop bar in 2018.
            </p>
            <p className="leading-relaxed">
              SwillFam began with a single bar and a simple idea: build a place that we, and the
              people around us, could call home. A place that&apos;s built to a feeling rather than
              a formula.
            </p>
            <p className="leading-relaxed">
              That first bar led to a second venue, then a third. Today the family spans
              restaurants, cocktail bars and clubs across Jakarta, from a cafe to an underground
              club. Each has its own identity, and none is a copy of the last.
            </p>
            <p className="leading-relaxed">
              What hasn&apos;t changed is why people keep coming back: spaces that feel made for
              them, in a city that never runs out of reasons to go out.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
