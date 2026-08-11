"use client";

import { useState } from "react";
import Image from "next/image";
import type { SegmentGallery } from "@/generated/prisma/client";
import { Lightbox } from "@/components/shared/Lightbox";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

/**
 * "What to Try" — 4-up grid of dishes. Built from a `special` SegmentGallery,
 * zipping `images` with the index-aligned `imageTitles` / `imageDescriptions`.
 * Hovering a card reveals its title + short description (CSS group-hover only).
 */
export function DishesSection({ gallery }: { gallery: SegmentGallery }) {
  const dishes = gallery.images.map((src, i) => ({
    src,
    title: gallery.imageTitles[i] ?? "",
    description: gallery.imageDescriptions[i] ?? "",
  }));

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (dishes.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-12">
        <SectionHeading title={gallery.title} lead={gallery.description} align="center" />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {dishes.map((dish, i) => (
            <div
              key={dish.src}
              className="group relative aspect-[4/5] overflow-hidden border border-sf-border/40"
            >
              <Image
                src={dish.src}
                alt={dish.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="cursor-zoom-in object-cover transition-transform duration-700 group-hover:scale-105"
                onClick={() => setLightboxIndex(i)}
              />
              {/* Hover overlay: dark wash + title/description */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="font-syne text-lg font-bold leading-tight text-white">
                  {dish.title}
                </h3>
                {dish.description ? (
                  <p className="font-inter text-sm leading-relaxed">
                    {dish.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Lightbox
        images={dishes.map((dish) => dish.src)}
        index={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  );
}
