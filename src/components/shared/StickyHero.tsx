"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { ParallaxHeroContent } from "@/components/shared/ParallaxHeroContent";

/**
 * Cinematic hero: the `backdrop` is pinned (position: sticky) as a fixed
 * background while the hero title, gradient, and all page sections scroll UP
 * over it. A scroll-driven black overlay darkens the backdrop to full black so
 * it fades out completely by the time the content covers it.
 *
 * The scrolling content block sits at `z-[60]` — above the layout's SiteHeader
 * (`z-50`) — so the rising content covers the top mega-nav too. The block's
 * first screen is transparent, so the backdrop (and header, through it) is
 * visible at the very top of the page.
 *
 * `backdrop` = any node that fills the pinned layer: an image hero passes
 * `<ParallaxImage><Image fill/></ParallaxImage>`, a WebGL hero passes the
 * component directly (e.g. `<PlasmaBackground className="absolute inset-0" />`).
 * `heroContent` = the title Container; `children` = the sections that scroll
 * over the backdrop.
 */
export function StickyHero({
  backdrop,
  heroContent,
  children,
}: {
  backdrop: React.ReactNode;
  heroContent: React.ReactNode;
  children: React.ReactNode;
}) {
  const firstScreenRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Progress scoped to the first viewport of scroll (the transparent hero screen
  // is exactly 100svh tall), so the backdrop fades to black across the first
  // screen — not stretched across the whole page.
  const { scrollYProgress } = useScroll({
    target: firstScreenRef,
    offset: ["start start", "end start"],
  });
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  // Once the backdrop is fully covered by the black overlay, hide it so a WebGL
  // backdrop's render loop pauses (via its IntersectionObserver) instead of
  // computing full-time behind an opaque layer. Invisible either way.
  const [covered, setCovered] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setCovered(v >= 0.999));

  // Reduced motion: render a plain, static hero + normal content flow.
  if (reduced) {
    return (
      <>
        <div className="relative h-[100svh] w-full overflow-hidden">
          <div className="absolute inset-0">{backdrop}</div>
          <div className="absolute inset-x-0 bottom-0 h-[225px] bg-gradient-to-t from-sf-bg to-transparent" />
          <div className="absolute inset-0">{heroContent}</div>
        </div>
        <div className="relative bg-sf-bg">{children}</div>
      </>
    );
  }

  return (
    <div className="relative">
      {/* Pinned backdrop — stays put while everything else scrolls over it. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className={cn("absolute inset-0", covered && "hidden")}>{backdrop}</div>
        <div className="absolute inset-x-0 bottom-0 h-[225px] bg-gradient-to-t from-sf-bg to-transparent" />
        {/* Scroll-driven fade-to-black. */}
        <motion.div
          className="absolute inset-0 bg-sf-bg will-change-[opacity]"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Scrolling content block: pulled up one viewport to overlap the pinned
          backdrop, above the top mega-nav (z-50) so it covers it as it rises. */}
      {/* pointer-events-none so the hero screen doesn't intercept clicks
          intended for the mega-nav behind it (z-50 v z-[60] stacking).
          Interactive children below override with pointer-events-auto. */}
      <div className="relative z-[60] -mt-[100svh] pointer-events-none">
        {/* Transparent first screen holds the title at the bottom; the backdrop
            (and header) shows through it at the top of the page. Also the scroll
            target that scopes the fade-to-black to one viewport. */}
        <div ref={firstScreenRef} className="pointer-events-none relative h-[100svh]">
          <ParallaxHeroContent>{heroContent}</ParallaxHeroContent>
        </div>
        {/* Smooth handoff from the transparent hero screen into the solid page. */}
        <div className="h-24 bg-gradient-to-b from-transparent to-sf-bg pointer-events-auto" />
        <div className="bg-sf-bg pointer-events-auto">{children}</div>
      </div>
    </div>
  );
}
