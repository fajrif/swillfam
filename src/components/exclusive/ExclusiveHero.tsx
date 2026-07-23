import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { ParallaxHeroContent } from "@/components/shared/ParallaxHeroContent";

export function ExclusiveHero() {
  return (
    <div className="relative h-[715px] w-full overflow-hidden">
      <ParallaxImage>
        <Image src="/gallery/banner.png" alt="" fill className="object-cover" priority />
      </ParallaxImage>
      <div className="absolute inset-x-0 bottom-0 h-[225px] bg-gradient-to-t from-sf-bg to-transparent" />
      <ParallaxHeroContent>
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Stories, Moments, and First Looks
          </h1>
        </Container>
      </ParallaxHeroContent>
    </div>
  );
}
