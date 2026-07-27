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
  ...rest
}: { src: string; alt: string } & Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt"
>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute inset-0 cursor-zoom-in"
        aria-label={`View ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          className={cn("pointer-events-none", className)}
          {...rest}
        />
      </button>

      <Lightbox images={[src]} index={0} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
