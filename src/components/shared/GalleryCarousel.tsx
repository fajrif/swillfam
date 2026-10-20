"use client";

import { useRef, useState } from "react";
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
import { Lightbox } from "@/components/shared/Lightbox";

/**
 * Reusable titled image carousel — heading + description + looping slider.
 * Generalized from the private-events "Moments We've Hosted" section so any
 * page (e.g. a venue's "Inside …" gallery or "Explore the Menu") can supply
 * its own title/description/images.
 */
export function GalleryCarousel({
  title,
  description,
  images,
}: {
  title: string;
  description?: string;
  /**
   * `{ src, alt }`, not bare paths. This is a Client Component, so it cannot
   * resolve stored alt text itself — the server builds the pairs with
   * `withAlts()`. The fallback it passes has always been "Inside Zoo (3)",
   * which is the weakest alt text on the site and the reason this prop
   * changed shape.
   */
  images: { src: string; alt: string }[];
}) {
  const apiRef = useRef<CarouselApi>(undefined);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
    <section className="py-16 lg:pb-24">
      <Container className="flex flex-col gap-12">
        <div className="mx-auto flex max-w-[740px] flex-col gap-4 text-center">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            {title}
          </h2>
          {description ? (
            <p className="font-inter leading-relaxed">{description}</p>
          ) : null}
        </div>

        <Carousel
          opts={{ align: "center", loop: true }}
          setApi={(api) => {
            apiRef.current = api;
          }}
          className="relative min-w-0"
        >
          <CarouselContent>
            {images.map((image, i) => (
              <CarouselItem key={image.src} className="basis-[85%] md:basis-[62%]">
                <div className="relative aspect-[870/630] w-full overflow-hidden bg-sf-surface">
                  {/* No `priority` on the first slide: a carousel is always
                      below the hero, and preloading here competes with the
                      real LCP element for bandwidth on first paint. */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 85vw, 60vw"
                    className="cursor-zoom-in object-cover"
                    onClick={() => setLightboxIndex(i)}
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

      <Lightbox
        images={images.map((image) => image.src)}
        index={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  );
}
