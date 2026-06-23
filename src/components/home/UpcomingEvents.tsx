"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Container } from "@/components/shared/Container";

const EVENTS = [
  {
    img: "/home/poster-1.png",
    title: "Mat & Mingle",
    shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    img: "/home/poster-2.png",
    title: "High Five",
    shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    img: "/home/poster-3.png",
    title: "Truce",
    shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

/** Upcoming Events (Figma 302:15) — left intro column + right poster slider. */
export function UpcomingEvents() {
  const apiRef = useRef<CarouselApi>(undefined);

  // Embla falls back loop:true to false when there's too little slide content
  // to loop without glitches (only 3 posters here), so wrap manually instead.
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
            Upcoming Events
          </h2>
          <p className="font-inter text-base leading-relaxed text-white/70 md:text-lg">
            Stay updated with upcoming events, special programs, parties, collaborations, and
            community gatherings happening across Swillfam&rsquo;s network.
          </p>
          <Button asChild size="pill" className="w-fit">
            <Link href="#">See all events</Link>
          </Button>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          setApi={(api) => {
            apiRef.current = api;
          }}
          className="relative min-w-0"
        >
          <CarouselContent>
            {EVENTS.map((event, i) => (
              <CarouselItem key={event.img} className="basis-[58%] sm:basis-[40%]">
                <div className="group flex flex-col gap-3">
                  <div className="relative aspect-[290/516] overflow-hidden bg-sf-surface">
                    <Image
                      src={event.img}
                      alt={`Upcoming event: ${event.title}`}
                      fill
                      sizes="(max-width: 1024px) 40vw, 290px"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                  <div className="opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <h3 className="font-syne text-base font-bold uppercase text-white">
                      {event.title}
                    </h3>
                    <p className="line-clamp-2 font-inter text-sm text-white/70">
                      {event.shortDescription}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            onClick={handlePrev}
            disabled={false}
            className="left-4 flex size-12 rounded-none border-sf-border/50 bg-sf-deep text-white [&_svg]:size-5 hover:bg-sf-deep/80 hover:text-white/80 sm:hidden"
          />
          <CarouselNext
            onClick={handleNext}
            disabled={false}
            className="right-4 flex size-12 rounded-none border-sf-border/50 bg-sf-deep text-white [&_svg]:size-5 hover:bg-sf-deep/80 hover:text-white/80"
          />
        </Carousel>
      </Container>
    </section>
  );
}
