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

/** Poster for a single promotion. A carousel with wrap-around arrows when the
 *  promotion has more than one image; a plain image otherwise. */
export function PromotionGallery({ images, alt }: { images: string[]; alt: string }) {
  const apiRef = useRef<CarouselApi>(undefined);

  if (images.length === 0) {
    return <div className="aspect-[4/5] w-full bg-sf-surface" />;
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sf-surface">
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

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
    <Carousel
      opts={{ align: "start", loop: true }}
      setApi={(api) => {
        apiRef.current = api;
      }}
      className="relative w-full min-w-0"
    >
      <CarouselContent>
        {images.map((img, i) => (
          <CarouselItem key={`${i}-${img}`}>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-sf-surface">
              <Image
                src={img}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
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
  );
}
