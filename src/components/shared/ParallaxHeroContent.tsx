"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue } from "framer-motion";

/** Wraps a hero's title/content so it drifts upward as the user scrolls through
 *  the hero — the "cinematic" counterpart to ParallaxImage's background drift.
 *  Same top-of-page scroll offset as ParallaxImage so both layers move in
 *  visible, complementary lockstep. */
export function ParallaxHeroContent({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const zero = useMotionValue(0);

  return (
    // h-full: the wrapped Container relies on its parent being the full hero
    // height (for its own h-full + flex-col + justify-end to anchor content
    // to the bottom) — without this, inserting this wrapper would collapse
    // that height chain and break the title's bottom-anchored position.
    <motion.div ref={ref} className="h-full" style={{ y: reduced ? zero : y }}>
      {children}
    </motion.div>
  );
}
