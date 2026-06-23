"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "./Container";
import type { SiteSettings } from "@/lib/site-settings";

const FOOTER_COLS: { label: string; href: string }[][] = [
  [
    { label: "About Us", href: "/about" },
    { label: "Venues", href: "/experience" },
    { label: "Events", href: "/experience" },
    { label: "The Swillfam Experience", href: "/experience" },
    { label: "Private Events", href: "/contact" },
  ],
  [
    { label: "Talents", href: "#" },
    { label: "Exclusive", href: "/articles" },
    { label: "Merchandise", href: "/merchandise" },
    { label: "Guides/Journal", href: "/articles" },
    { label: "Contact", href: "/contact" },
  ],
];

const SOCIALS = [
  { icon: "ph-linkedin-logo", label: "LinkedIn" },
  { icon: "ph-tiktok-logo", label: "TikTok" },
  { icon: "ph-youtube-logo", label: "YouTube" },
  { icon: "ph-instagram-logo", label: "Instagram" },
];

/** Footer / Newsletter (Figma 831:313). */
export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const [email, setEmail] = useState("");

  return (
    <>
      <footer className="border-t border-sf-border/60 bg-sf-deep text-white">
        {/* Newsletter */}
        <Container className="border-x border-sf-border/60 bg-sf-deep flex flex-col items-center gap-8 py-16 text-center">
          <h2 className="font-syne text-[clamp(1.75rem,4vw,48px)] uppercase text-white">
            Stay in the Loop!
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="flex w-full max-w-[680px] flex-col items-center gap-8"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here"
              className="h-[50px] w-full rounded-none border-0 border-b border-white bg-transparent px-2 text-center font-inter text-white placeholder:text-white/50 focus-visible:border-white focus-visible:ring-0"
            />
            <Button type="submit" variant="pill" size="pill">
              Subscribe
            </Button>
          </form>
        </Container>

        {/* Swillfam signature — decorative separator */}
        <Container className="border-x border-sf-border/60 bg-sf-deep flex justify-center">
          <Image
            src="/home/footer-signature.png"
            alt="SwillFam"
            width={269}
            height={118}
            className="h-34 w-auto"
          />
        </Container>

        {/* Contact (left) + WhatsApp & nav links (bottom-right) */}
        <Container className="grid grid-cols-1 gap-12 py-8 md:grid-cols-2 border-x border-sf-border/60 bg-sf-deep">
          {/* Left: find us + socials + email + address */}
          <div className="flex flex-col gap-4">
            <p className="font-inter text-base text-white">Find us:</p>
            <div className="flex gap-4">
              {SOCIALS.map(({ icon, label }) => {
                const socialKey = `social${label}` as keyof SiteSettings;
                const href = settings[socialKey] || "#";
                return (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-white transition-colors hover:text-sf-accent"
                  >
                    <i className={`ph ${icon} text-xl`} aria-hidden />
                  </Link>
                );
              })}
            </div>
            {settings.mainEmail && (
              <p className="font-inter text-base text-white">
                Email:{" "}
                <a href={`mailto:${settings.mainEmail}`} className="hover:text-sf-accent">
                  {settings.mainEmail}
                </a>
              </p>
            )}
            <div className="font-inter text-sm leading-relaxed text-white">
              {settings.officeAddressLine1 && (
                <p className="text-base font-semibold">{settings.officeAddressLine1}</p>
              )}
              {settings.officeAddressLine2 && <p>{settings.officeAddressLine2}<br/></p>}
              {settings.officeAddressCity && <p>{settings.officeAddressCity}</p>}
            </div>
          </div>

          {/* Right: WhatsApp on top, nav links anchored bottom-right */}
          <div className="flex flex-col items-end justify-between gap-2">
            {settings.mainWhatsapp && (
              <Link
                href={`https://wa.me/${settings.mainWhatsapp.replace(/[^0-9]/g, "")}`}
                aria-label="WhatsApp"
              >
                <Image
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  width={64}
                  height={64}
                  className="h-16 w-auto"
                />
              </Link>
            )}
            <div className="flex gap-12 text-right">
              {FOOTER_COLS.map((col, i) => (
                <ul key={i} className="flex flex-col">
                  {col.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-inter text-sm uppercase tracking-wide text-white transition-colors hover:text-sf-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Container>
      </footer>
      {/* Legal bar */}
      <footer className="border-t border-sf-border/60 bg-sf-deep text-white">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 border-x border-sf-border/60 bg-sf-deep text-center font-inter text-xs text-white sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Swillfam. All rights reserved</p>
          <p className="inline-flex items-center gap-4">
            <Link href="/privacy" className="hover:text-sf-accent">
              Privacy Policy
            </Link>
            <span aria-hidden>/</span>
            <Link href="/terms" className="hover:text-sf-accent">
              Terms &amp; Conditions
            </Link>
          </p>
        </Container>
      </footer>
    </>
  );
}
