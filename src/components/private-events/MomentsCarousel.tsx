"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Container } from "@/components/shared/Container";
import { GALLERY } from "./data";

/** "Moments We've Hosted" — heading + looping gallery carousel. */
export function MomentsCarousel() {
  const apiRef = useRef<CarouselApi>(undefined);

  // Embla disables loop when there's too little content; wrap manually.
  const handlePrev = () => {
    const api = apiRef.current;
    if (!api) return;
    if (api.canScrollPrev()) api.scrollPrev();
    else api.scrollTo(api.scrollSnapList().length - 1);
  };

  const handleNext = () => {
    const api = apiRef.current;
    if (!api) return;
    if (api.canScrollNext()) api.scrollNext();
    else api.scrollTo(0);
  };

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        <div className="mx-auto flex max-w-[740px] flex-col gap-4 text-center">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            Moments We&apos;ve Hosted
          </h2>
          <p className="font-inter leading-relaxed text-white">
            Explore a selection of celebrations, corporate functions, launches, and special occasions
            hosted across the SwillFam family of venues.
          </p>
        </div>

        <Carousel
          opts={{ align: "center", loop: true }}
          setApi={(api) => {
            apiRef.current = api;
          }}
          className="relative min-w-0"
        >
          <CarouselContent>
            {GALLERY.map((src, i) => (
              <CarouselItem key={src} className="basis-[85%] md:basis-[62%]">
                <div className="relative aspect-[870/630] w-full overflow-hidden bg-sf-surface">
                  <Image
                    src={src}
                    alt={`A SwillFam event we've hosted (${i + 1})`}
                    fill
                    sizes="(max-width: 1024px) 85vw, 60vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            onClick={handlePrev}
            disabled={false}
            className="left-4 flex size-12 rounded-none border-sf-border/50 bg-sf-deep text-white [&_svg]:size-5 hover:bg-sf-deep/80 hover:text-white"
          />
          <CarouselNext
            onClick={handleNext}
            disabled={false}
            className="right-4 flex size-12 rounded-none border-sf-border/50 bg-sf-deep text-white [&_svg]:size-5 hover:bg-sf-deep/80 hover:text-white"
          />
        </Carousel>
      </Container>
    </section>
  );
}
