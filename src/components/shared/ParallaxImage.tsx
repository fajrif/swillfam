"use client";

import { useRef } from "react";
import { useScroll, useTransform, useReducedMotion, useMotionValue } from "framer-motion";
import { motion } from "framer-motion";

/** Scroll-linked parallax on a background image. The inner wrapper is
 *  deliberately oversized (taller than its container) before being translated,
 *  so the translate never exposes empty space at the top/bottom edge — same
 *  technique as ParallaxCategoryTile. The `["start start", "end start"]` offset
 *  is correct for elements pinned at the very top of the page (hero sections):
 *  progress is 0 exactly at page load and 1 when the element has fully
 *  scrolled past, using the entire 0–1 range across the scroll distance the
 *  user actually experiences. */
export function ParallaxImage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const zero = useMotionValue(0);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-x-0 top-[-20%] h-[140%] will-change-transform"
        style={{ y: reduced ? zero : y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
