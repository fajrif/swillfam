"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CategoryTileData } from "./DualImageColumnSection";

/** Same visual as CategoryTile, but the image sits in an oversized wrapper
 *  driven by a scroll-linked `y` MotionValue (see ParallaxTileGrid). */
export function ParallaxCategoryTile({
  src,
  label,
  labelAlign,
  description,
  href,
  y,
}: CategoryTileData & { y: MotionValue<number> }) {
  const content = (
    <>
      <div className="absolute inset-0 overflow-hidden border border-sf-border/50">
        <motion.div className="absolute inset-x-0 top-[-18%] h-[136%] will-change-transform" style={{ y }}>
          <Image
            src={src}
            alt={label}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover scale-100 transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div
        className={cn(
          "absolute flex max-w-[420px] flex-col gap-3 p-6 lg:p-8",
          labelAlign === "top-left"
            ? "left-0 top-0 items-start text-left"
            : "bottom-0 right-0 items-end text-right",
        )}
      >
        <span className="font-syne text-[clamp(2rem,4vw,48px)] font-extrabold uppercase leading-none text-white transition-all duration-300 group-hover:[filter:drop-shadow(0_0_6px_#fff)_drop-shadow(0_0_3px_#f5f)]">
          {label}
        </span>
        {description ? (
          <p className="font-inter text-sm leading-relaxed md:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group relative aspect-[645/614] overflow-hidden block">
        {content}
      </Link>
    );
  }

  return (
    <div className="group relative aspect-[645/614] overflow-hidden">
      {content}
    </div>
  );
}
