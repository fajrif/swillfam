import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { MetaballsBackground } from "@/components/reactbits/MetaballsBackground";

/** Hero (Figma nodes 231:96 bg, 231:109 wordmark, 291:8 tagline, 471:3 featured card). */
export function Hero() {
  return (
    <section className="relative flex min-h-[620px] items-end overflow-hidden lg:h-[715px] lg:min-h-0">
      {/* Animated plasma background (replaces the former static photo + overlays) */}
      <MetaballsBackground
        className="absolute inset-0"
        speed={0.5}
        direction="forward"
        scale={1.8}
        opacity={0.8}
      />

      <Container className="relative z-10 grid w-full grid-cols-1 items-end gap-8 pb-12 lg:grid-cols-[1fr_auto] lg:pb-16">
        <h1 className="order-2 font-syne text-[clamp(3.25rem,13vw,130px)] font-bold uppercase leading-[0.9] tracking-tight text-white lg:order-1">
          SwillFam
        </h1>

        <div className="order-1 flex max-w-[480px] flex-col gap-5 lg:order-2 lg:items-end lg:text-right">
          {/* Featured-event mini card */}
          <div className="flex items-center gap-4 border border-white/10 bg-sf-surface/70 p-3 backdrop-blur-sm">
            <Image
              src="/home/trusted-3.png"
              alt=""
              width={84}
              height={84}
              className="size-[68px] shrink-0 object-cover"
            />
            <div className="text-left">
              <p className="font-archivo text-[13px] font-semibold uppercase tracking-wide text-white">
                Newest Featured Event
              </p>
              <p className="mt-1 font-inter text-xs leading-snug text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
            </div>
          </div>

          <p className="font-syne text-2xl font-semibold leading-snug text-white lg:text-[33px]">
            Discover the City&rsquo;s Best Lifestyle &amp; Nightlife Experiences
          </p>
        </div>
      </Container>
    </section>
  );
}
