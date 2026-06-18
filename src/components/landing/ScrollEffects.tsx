"use client";

import { useEffect } from "react";

/** Wires the reveal-on-scroll fade-up and sticky-navbar shadow, mirroring the design's IO/scroll script. */
export function ScrollEffects() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 100);
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );

    document.querySelectorAll(".reveal-element").forEach((el) => observer.observe(el));

    const navbar = document.getElementById("navbar");
    const onScroll = () => {
      if (!navbar) return;
      if (window.pageYOffset > 100) {
        navbar.classList.add("shadow-md");
        navbar.classList.replace("border-brand-black/10", "border-transparent");
      } else {
        navbar.classList.remove("shadow-md");
        navbar.classList.replace("border-transparent", "border-brand-black/10");
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
