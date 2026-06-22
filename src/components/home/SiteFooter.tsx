"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "./Container";

const FOOTER_COLS: { label: string; href: string }[][] = [
  [
    { label: "About Us", href: "#" },
    { label: "Venues", href: "#" },
    { label: "Events", href: "#" },
    { label: "The Swillfam Experience", href: "#" },
    { label: "Private Events", href: "#" },
  ],
  [
    { label: "Talents", href: "#" },
    { label: "Exclusive Merchandise", href: "#" },
    { label: "Guides/Journal", href: "#" },
    { label: "Contact", href: "#" },
  ],
];

// Phosphor brand glyphs (web font loaded globally in the root layout)
const SOCIALS = [
  { icon: "ph-instagram-logo", label: "Instagram" },
  { icon: "ph-facebook-logo", label: "Facebook" },
  { icon: "ph-x-logo", label: "X" },
  { icon: "ph-youtube-logo", label: "YouTube" },
];

/** Footer / Newsletter (Figma 831:313). */
export function SiteFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-sf-border/60 bg-sf-deep">
      {/* Newsletter */}
      <Container className="flex flex-col items-center gap-6 py-16 text-center">
        <Image
          src="/home/footer-signature.png"
          alt="SwillFam"
          width={269}
          height={118}
          className="h-16 w-auto"
        />
        <h2 className="font-syne text-[clamp(1.75rem,4vw,48px)] text-white">Stay in the Loop!</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
          }}
          className="flex w-full max-w-[520px] flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email here"
            className="h-[50px] flex-1 rounded-full border-white/20 bg-transparent px-5 font-inter text-white placeholder:text-white/40"
          />
          <Button type="submit" variant="pill" size="pill">
            Subscribe
          </Button>
        </form>
      </Container>

      {/* Link + contact grid */}
      <Container className="grid grid-cols-1 gap-10 border-t border-sf-border/40 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="max-w-[360px] font-inter text-sm leading-relaxed text-white/60">
            Fairgrounds, SCBD lot 14, Jl. Jenderal Sudirman, RT.5/RW.3, Senayan, Kec. Kby. Baru, Kota
            Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12190
          </p>
          <p className="font-inter text-sm text-white/80">
            Find us:{" "}
            <a href="mailto:contact@swillfam.com" className="hover:text-white">
              contact@swillfam.com
            </a>
          </p>
          <div className="mt-2 flex gap-4">
            {SOCIALS.map(({ icon, label }) => (
              <Link
                key={label}
                href="#"
                aria-label={label}
                className="text-white/60 transition-colors hover:text-sf-accent"
              >
                <i className={`ph ${icon} text-xl`} aria-hidden />
              </Link>
            ))}
          </div>
        </div>

        {FOOTER_COLS.map((col, i) => (
          <ul key={i} className="flex flex-col gap-3">
            {col.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-inter text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </Container>

      {/* Legal bar */}
      <Container className="flex flex-col items-center justify-between gap-3 border-t border-sf-border/40 py-6 text-center font-inter text-xs text-white/50 sm:flex-row sm:text-left">
        <p>© 2026 Swillfam. All rights reserved</p>
        <p>
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>{" "}
          /{" "}
          <Link href="/terms" className="hover:text-white">
            Terms &amp; Conditions
          </Link>
        </p>
      </Container>
    </footer>
  );
}
