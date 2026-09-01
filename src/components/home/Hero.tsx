"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
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
  featuredEvents = [],
}: {
  children: React.ReactNode;
  featuredEvents?: FeaturedEventData[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: true })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

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
          <h1 className="font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] tracking-tight text-white">
            What&rsquo;s on the Radar
          </h1>

          <div className="flex max-w-[450px] flex-col gap-5">
            {featuredEvents.length > 0 && (
              <>
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex">
                    {featuredEvents.map((event) => (
                      <div key={event.slug} className="min-w-0 shrink-0 grow-0 basis-full">
                        <Link
                          href={`/events/${event.slug}`}
                          className="pointer-events-auto flex items-center gap-4 border border-white/10 bg-sf-surface/70 p-3 backdrop-blur-sm transition-colors hover:bg-sf-surface/50"
                        >
                          <Image
                            src={event.image ?? "/home/trusted-3.png"}
                            alt=""
                            width={84}
                            height={84}
                            className="size-[68px] shrink-0 object-cover"
                          />
                          <div className="text-left">
                            <p className="font-archivo text-[13px] font-semibold uppercase tracking-wide text-white">
                              {event.name}
                            </p>
                            <p className="mt-1 font-inter text-xs leading-snug">
                              {event.caption}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {featuredEvents.length > 1 && (
                  <div className="pointer-events-auto flex justify-center gap-2">
                    {featuredEvents.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => emblaApi?.scrollTo(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === selectedIndex
                            ? "w-6 bg-white"
                            : "w-2 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            <p className="font-inter text-base leading-relaxed text-white md:text-lg">
              Check out what&rsquo;s drawing the city&rsquo;s attention right now. Immersive
              spaces, unforgettable energy, and experiences built for those who want more than
              just a night out.
            </p>
          </div>
        </Container>
      }
    >
      {children}
    </StickyHero>
  );
}
