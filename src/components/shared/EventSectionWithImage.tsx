"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Container } from "@/components/shared/Container";
import {
  DualImageColumnSection,
  type CategoryTileData,
} from "@/components/shared/DualImageColumnSection";

export type EventCarouselItem = {
  img: string;
  title: string;
  shortDescription: string;
  href?: string;
};

/**
 * Generic "intro column + poster slider" section (Figma 302:15). Generalized
 * from the home page's Upcoming Events so it can render events, promotions, or
 * any titled poster carousel. Optionally renders a row of DualImageColumnSection
 * tiles beneath the carousel.
 */
export function EventSectionWithImage({
  title,
  description,
  ctaText,
  ctaHref,
  items,
  tiles,
}: {
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  items: EventCarouselItem[];
  tiles?: CategoryTileData[];
}) {
  const apiRef = useRef<CarouselApi>(undefined);

  // Embla falls back loop:true to false when there's too little slide content
  // to loop without glitches, so wrap manually instead.
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
    <section className="py-16">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-top">
        <div className="flex max-w-[560px] flex-col gap-6">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-sf-text">
            {title}
          </h2>
          <p className="font-inter text-base leading-relaxed text-white md:text-lg">
            {description}
          </p>
          {ctaHref && ctaText ? (
            <Link
              href={ctaHref}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[30px] border border-sf-accent bg-transparent text-white font-archivo uppercase tracking-[0.06em] transition-colors hover:bg-sf-accent h-[50px] px-9 text-[15px] w-fit"
            >
              {ctaText}
            </Link>
          ) : null}
        </div>

        {items.length > 0 ? (
          <Carousel
            opts={{ align: "start", loop: true }}
            setApi={(api) => {
              apiRef.current = api;
            }}
            className="relative min-w-0"
          >
            <CarouselContent>
              {items.map((item, i) => {
                const card = (
                  <div className="group flex flex-col gap-3">
                    <div className="relative aspect-[290/516] overflow-hidden bg-sf-surface">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 40vw, 290px"
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                    <div className="opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <h3 className="font-syne text-base font-bold uppercase text-white">
                        {item.title}
                      </h3>
                      <p className="line-clamp-2 font-inter text-sm text-white">
                        {item.shortDescription}
                      </p>
                    </div>
                  </div>
                );
                return (
                  <CarouselItem key={item.img} className="basis-[58%] sm:basis-[40%]">
                    {item.href ? (
                      <Link href={item.href} className="block">
                        {card}
                      </Link>
                    ) : (
                      card
                    )}
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious
              onClick={handlePrev}
              disabled={false}
              className="left-4 flex size-12 rounded-none border-sf-border/50 bg-sf-deep text-white [&_svg]:size-5 hover:bg-sf-deep/80 hover:text-white/80 sm:hidden"
            />
            <CarouselNext
              onClick={handleNext}
              disabled={false}
              className="right-4 flex size-12 rounded-none border-sf-border/50 bg-sf-deep text-white [&_svg]:size-5 hover:bg-sf-deep/80 hover:text-white"
            />
          </Carousel>
        ) : null}
      </Container>

      {tiles && tiles.length > 0 ? (
        <DualImageColumnSection title="" tiles={tiles} />
      ) : null}
    </section>
  );
}
