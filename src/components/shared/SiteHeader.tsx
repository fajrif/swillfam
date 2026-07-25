"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/Container";
import { NAV_GROUPS } from "./nav-data";

/** The three stacked link columns — shared by the top mega-nav and the compact
 *  header's expanding panel so link positions stay identical. Stacks on mobile. */
function NavColumns({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="flex flex-col gap-8 md:flex-row md:gap-10 text-right">
      {NAV_GROUPS.map((group, i) => (
        <ul key={i} className="flex flex-col">
          {group.map((link) => (
            <li key={link.label} className="grid">
                <span
                  className="invisible col-start-1 row-start-1 font-syne font-bold text-base uppercase tracking-wide"
                  aria-hidden="true"
                >
                  {link.label}
                </span>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "col-start-1 row-start-1 font-inter text-base tracking-wide uppercase text-white",
                    isActive(link.href)
                      ? "font-syne font-bold"
                      : "hover:font-syne hover:font-bold",
                  )}
                >
                  {link.label}
                </Link>
              </li>
          ))}
        </ul>
      ))}
    </nav>
  );
}

/**
 * Scroll-transforming nav (Figma mega-nav, node 231:100). At the very top:
 * the transparent mega-nav (logo-left / 3-column nav-right). As the user
 * scrolls it fades out and a compact fixed bar (blurred, hamburger-left /
 * logo-right) takes over; the hamburger toggles a panel with the same
 * 3-column links. Scrolling back to the top restores the mega-nav.
 * (On mobile the compact bar is always shown — there's no room for the mega-nav.)
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();
  const topOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 80);
    if (v <= 80 && open) setOpen(false); // collapse the panel when back at top
  });

  return (
    <>
      {/* Top mega-nav — desktop only, fades out on scroll. */}
      <motion.header
        className="absolute inset-x-0 top-0 z-50 hidden lg:block"
        style={{ opacity: topOpacity, pointerEvents: scrolled ? "none" : "auto" }}
      >
        <Container className="flex items-start justify-between py-6 lg:py-8">
          <Link href="/" aria-label="SwillFam home" className="shrink-0">
            <Image
              src="/logo-swillfam.png"
              alt="SwillFam"
              width={93}
              height={41}
              priority
              className="h-9 w-auto lg:h-10"
            />
          </Link>
          <NavColumns />
        </Container>
      </motion.header>

      {/* Compact bar — always visible on mobile; on desktop only once scrolled. */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-[opacity,transform] duration-300",
          scrolled
            ? "translate-y-0 opacity-100"
            : "translate-y-0 opacity-100 lg:pointer-events-none lg:-translate-y-full lg:opacity-0",
        )}
      >
        <div
          className={cn(
            "transition-[background,border-color] duration-300",
            scrolled || open
              ? "border-b border-sf-border/40 bg-sf-bg/70 backdrop-blur-md"
              : "border-transparent bg-transparent",
          )}
        >
          <Container className="flex items-center justify-between py-4">
            {/* Logo — left. */}
            <Link
              href="/"
              aria-label="SwillFam home"
              className="shrink-0"
              onClick={() => setOpen(false)}
            >
              <Image src="/logo-swillfam.png" alt="SwillFam" width={93} height={41} className="h-8 w-auto" />
            </Link>

            {/* Hamburger / close — right. */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative size-7 text-white"
            >
              <Menu
                className={cn(
                  "absolute inset-0 m-auto size-7 transition-all duration-300",
                  open ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
                )}
              />
              <X
                className={cn(
                  "absolute inset-0 m-auto size-7 transition-all duration-300",
                  open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
                )}
              />
            </button>
          </Container>

          {/* Expanding menu panel — same 3-column layout as the top mega-nav. */}
          <div
            className={cn(
              "overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
              open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <Container className="flex justify-end pt-1 pb-8">
              <NavColumns onNavigate={() => setOpen(false)} />
            </Container>
          </div>
        </div>
      </header>
    </>
  );
}
