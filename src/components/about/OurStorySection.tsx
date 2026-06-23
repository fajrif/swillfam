import Image from "next/image";
import { Container } from "@/components/shared/Container";

export function OurStorySection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        {/* Row 1: eyebrow + heading, vertically centered with the intro line */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-2">
            <p className="font-inter text-lg font-thin text-white">Our Story</p>
            <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white mr-2">
              More Than a Hospitality Group
            </h2>
          </div>
          <p className="font-inter text-3xl leading-relaxed text-white">
            SwillFam began with a vision to redefine what nightlife could be.
          </p>
        </div>

        {/* Row 2: image + remaining story text, "Not simply..." aligned to the image top */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[683/547] w-full overflow-hidden border border-sf-border/30">
            <Image
              src="/about/our-story.png"
              alt="A SwillFam venue at night"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-6 font-inter text-white">
            <p className="font-syne text-[clamp(1.75rem,3vw,40px)] font-semibold leading-tight italic">
              Not simply venues.
              <br />
              Not simply events.
            </p>
            <p className="text-lg leading-relaxed text-white">
              But destinations with personality, culture, and community at their core.
            </p>
            <p className="leading-relaxed text-white">
              What started as an ambition to create unique experiences has evolved into a growing
              portfolio of hospitality concepts that have become part of Jakarta&apos;s social
              landscape. Each venue is designed with its own identity, atmosphere, and purpose, while
              remaining connected through a shared commitment to exceptional experiences.
            </p>
            <p className="leading-relaxed text-white">
              Today, SwillFam continues to bring together music, design, food, drinks, entertainment,
              and people under one ecosystem, creating spaces where every visit feels memorable.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
