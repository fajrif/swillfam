import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { MetaballsBackground } from "@/components/reactbits/MetaballsBackground";

export type FeaturedEventData = {
  image: string | null;
  name: string;
  shortDescription: string;
  caption: string;
  slug: string;
};

export function Hero({
  children,
  featuredEvent,
}: {
  children: React.ReactNode;
  featuredEvent?: FeaturedEventData | null;
}) {
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

          <div className="flex max-w-[450px] flex-col gap-5">
            {featuredEvent ? (
              <Link
                href={`/events/${featuredEvent.slug}`}
                className="pointer-events-auto flex items-center gap-4 border border-white/10 bg-sf-surface/70 p-3 backdrop-blur-sm transition-colors hover:bg-sf-surface/50"
              >
                <Image
                  src={featuredEvent.image ?? "/home/trusted-3.png"}
                  alt=""
                  width={84}
                  height={84}
                  className="size-[68px] shrink-0 object-cover"
                />
                <div className="text-left">
                  <p className="font-archivo text-[13px] font-semibold uppercase tracking-wide text-white">
                   {featuredEvent.name} 
                  </p>
                  <p className="mt-1 font-inter text-xs leading-snug text-white">
                    {featuredEvent.caption}
                  </p>
                </div>
              </Link>
            ) : null}

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
