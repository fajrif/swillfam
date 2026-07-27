"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

/**
 * Lenis drives the real scroll position every rAF tick from its own internal
 * state, so Next's router doesn't actually move the page on a pathname
 * change (e.g. /talents/dj-nova -> /talents/dj-ezra) — Lenis just overwrites
 * it back on the next frame. Skips the very first render so a hard-loaded
 * #anchor link (Lenis's `anchors` option) isn't fought on initial load.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}
