import Image from "next/image";
import { Container } from "@/components/shared/Container";

export function DesignExperienceSection() {
  return (
    <section className="border-t border-sf-border/60 py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="font-inter text-lg font-thin text-white">Philosophy &amp; Experience</p>
            <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
              We Design Experiences, Not Just Venues
            </h2>
          </div>
          <div className="flex items-center">
            <p className="text-xl font-inter leading-relaxed text-white">
              We believe the best venues are more than places to eat or drink, they become part of
              people&apos;s lives. Every SwillFam concept is built around a unique identity,
              carefully shaped through design, atmosphere, music, culinary direction, and service. We
              pay attention to every detail because great experiences are created through thousands
              of thoughtful decisions.
            </p>
          </div>
        </div>

        <div className="relative aspect-[1389/570] w-full overflow-hidden border border-sf-border/30">
          <Image
            src="/about/malachi-clark.png"
            alt="A SwillFam night in motion"
            fill
            sizes="(max-width: 1440px) 100vw, 1390px"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
