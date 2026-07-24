import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { MetaballsBackground } from "@/components/reactbits/MetaballsBackground";

export function Hero({ children }: { children: React.ReactNode }) {
  return (
    <StickyHero
      backdrop={
        <MetaballsBackground
          className="absolute inset-0"
          speed={0.5}
          direction="forward"
          scale={1.8}
          scaleMobile={0.8}
          opacity={0.8}
        />
      }
      heroContent={
        <Container className="relative z-10 grid h-full w-full grid-cols-1 items-end gap-8 pb-12 lg:grid-cols-[1fr_auto] lg:pb-16">
          <h1 className="font-syne text-[clamp(3.25rem,13vw,130px)] font-bold uppercase leading-[0.9] tracking-tight text-white">
            SwillFam
          </h1>

          <div className="flex max-w-[480px] flex-col gap-5 lg:items-end lg:text-right">
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
      }
    >
      {children}
    </StickyHero>
  );
}
