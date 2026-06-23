import { Container } from "@/components/shared/Container";
import { STAND_WORDS_TOP, STAND_WORDS_BOTTOM } from "./data";

function StandWord({ word }: { word: string }) {
  return (
    <p className="border-t border-sf-border/40 py-3 text-center font-syne text-[clamp(2.5rem,9vw,96px)] font-bold uppercase leading-none text-white first:border-t-0">
      {word}
    </p>
  );
}

export function WhatWeStandForSection() {
  return (
    <section className="border-t border-sf-border/60 py-16 lg:py-24">
      <Container>
        <h2 className="text-center font-syne text-[clamp(2rem,5vw,64px)] leading-[1.1] text-white">
          What We Stand For:
        </h2>
      </Container>

      <div className="mt-12 border-y border-sf-border/40">
        {STAND_WORDS_TOP.map((word) => (
          <StandWord key={word} word={word} />
        ))}
      </div>

      {/* Magenta culture marquee band */}
      <div className="relative flex items-center overflow-hidden bg-sf-accent py-6">
        <div className="absolute inset-0 flex items-center whitespace-nowrap font-syne text-[clamp(3rem,8vw,96px)] font-bold uppercase leading-none text-white/25">
          <div className="animate-marquee flex shrink-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="px-8">
                Culture
              </span>
            ))}
          </div>
        </div>
        <Container className="relative z-10">
          <p className="mx-auto max-w-2xl text-center font-inter text-sm leading-relaxed text-white md:text-base">
            SwillFam is built around culture, connection, and shared experiences. Through food,
            drinks, music, venues, and events, SwillFam creates spaces where people come together,
            express themselves, and become part of the city&apos;s lifestyle scene.
          </p>
        </Container>
      </div>

      <div className="border-b border-sf-border/40">
        {STAND_WORDS_BOTTOM.map((word) => (
          <StandWord key={word} word={word} />
        ))}
      </div>
    </section>
  );
}
