"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/shared/Lightbox";

/**
 * Drop-in single-image lightbox trigger — for spots with exactly one image
 * and no gallery to navigate. For a set of images, use `Lightbox` directly
 * with a shared index so prev/next works across the whole set (see
 * `GalleryCarousel` / `DishesSection`).
 */
export function ZoomableImage({
  src,
  alt,
  className,
  natural = false,
  ...rest
}: {
  src: string;
  alt: string;
  /**
   * Show the picture whole, at its own proportions, instead of filling a
   * box the caller sized (which crops it with `object-cover`). The caller then
   * passes no `fill`; the width comes from the column it sits in.
   */
  natural?: boolean;
} & Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt"
>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={natural ? "block w-full cursor-zoom-in" : "absolute inset-0 cursor-zoom-in"}
        aria-label={`View ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          className={cn("pointer-events-none", natural && "h-auto w-full", className)}
          {...(natural ? { width: 0, height: 0 } : {})}
          {...rest}
        />
      </button>

      <Lightbox images={[src]} index={0} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
