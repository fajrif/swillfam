"use client";

import { useRef } from "react";
import { useScroll, useTransform, useReducedMotion, useMotionValue } from "framer-motion";
import { ParallaxCategoryTile } from "./ParallaxCategoryTile";
import type { CategoryTileData } from "./DualImageColumnSection";

/** Grid of tiles whose images parallax against scroll (opposite directions on
 *  alternating tiles, matching a two-column layout). Only two `useTransform`
 *  ranges are declared (not one per tile) so this stays valid regardless of
 *  tile count — Rules of Hooks forbids calling hooks inside `.map()`. */
export function ParallaxTileGrid({ tiles }: { tiles: CategoryTileData[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yEven = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const yOdd = useTransform(scrollYProgress, [0, 1], [-28, 28]);
  const zero = useMotionValue(0);

  return (
    <div ref={sectionRef} className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {tiles.map((tile, i) => (
        <ParallaxCategoryTile
          key={tile.label}
          {...tile}
          y={reduced ? zero : i % 2 === 0 ? yEven : yOdd}
        />
      ))}
    </div>
  );
}
