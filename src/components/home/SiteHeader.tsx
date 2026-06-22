"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { NAV_GROUPS, NAV_LINKS } from "./nav-data";

/** Transparent mega-nav overlaid on the hero (Figma node 231:100). */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
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

        {/* Desktop mega-nav: three stacked link columns */}
        <nav className="hidden gap-x-10 lg:flex">
          {NAV_GROUPS.map((group, i) => (
            <ul key={i} className="flex flex-col gap-2">
              {group.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-syne text-[13px] tracking-wide text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="text-white lg:hidden"
        >
          <Menu className="size-7" />
        </button>
      </Container>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-sf-bg/98 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <Container className="flex items-center justify-between py-6">
          <Image src="/logo-swillfam.png" alt="SwillFam" width={93} height={41} className="h-9 w-auto" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="text-white"
          >
            <X className="size-7" />
          </button>
        </Container>
        <nav className="mt-6 flex flex-col gap-5 px-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-syne text-2xl text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
