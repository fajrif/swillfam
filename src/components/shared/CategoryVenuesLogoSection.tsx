"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  motion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

export type LogoItem = { src: string; alt: string };

export type CategoryVenuesTileData = {
  src: string;
  label: string;
  labelAlign: "top-left" | "bottom-right";
  description?: string;
  href?: string;
  logos: LogoItem[];
};

type Props = {
  title?: string;
  description?: string;
  titleClassName?: string;
  tiles: CategoryVenuesTileData[];
  parallax?: boolean;
  /** Seconds for one full marquee cycle (default 30). */
  marqueeSpeed?: number;
};

export function CategoryVenuesLogoSection({
  title = "Explore by Category",
  description,
  titleClassName,
  tiles,
  parallax = false,
  marqueeSpeed = 30,
}: Props) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-10">
        {title ? (
          <SectionHeading title={title} lead={description} titleClassName={titleClassName} />
        ) : null}
        {parallax ? (
          <ParallaxGrid tiles={tiles} marqueeSpeed={marqueeSpeed} />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {tiles.map((tile) => (
              <Tile key={tile.label} {...tile} marqueeSpeed={marqueeSpeed} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

// ── Tile (static) ──────────────────────────────────────────────────────────

function Tile({
  src,
  label,
  labelAlign,
  description,
  href,
  logos,
  marqueeSpeed = 30,
}: CategoryVenuesTileData & { marqueeSpeed?: number }) {
  const content = (
    <>
      <div className="absolute inset-0 overflow-hidden border border-sf-border/50">
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover scale-100 transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div
        className={cn(
          "absolute flex max-w-[420px] flex-col gap-3 p-6 lg:p-8",
          labelAlign === "top-left"
            ? "left-0 top-0 items-start text-left"
            : "bottom-0 right-0 items-end text-right",
        )}
      >
        <span className="font-syne text-[clamp(2rem,4vw,48px)] font-extrabold uppercase leading-none text-white transition-all duration-300 group-hover:[filter:drop-shadow(0_0_6px_#fff)_drop-shadow(0_0_3px_#f5f)]">
          {label}
        </span>
      </div>
      <LogoMarquee
        logos={logos}
        position={labelAlign === "top-left" ? "bottom" : "top"}
        direction={labelAlign === "top-left" ? "left" : "right"}
        speed={marqueeSpeed}
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group relative block aspect-[645/614] overflow-hidden">
        {content}
      </Link>
    );
  }

  return (
    <div className="group relative aspect-[645/614] overflow-hidden">
      {content}
    </div>
  );
}

// ── Logo Marquee ───────────────────────────────────────────────────────────

function LogoMarquee({
  logos,
  position,
  direction,
  speed = 30,
}: {
  logos: LogoItem[];
  position: "top" | "bottom";
  direction: "left" | "right";
  speed?: number;
}) {
  if (logos.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div
        className={cn(
          "absolute inset-x-0 overflow-hidden pointer-events-none",
          "h-28 lg:h-36",
          position === "top" ? "top-4" : "bottom-4",
        )}
      >
        <div
          className="flex h-full items-center gap-8 lg:gap-12 will-change-transform"
          style={{
            animation: `marquee-${direction} ${speed}s linear infinite`,
          }}
        >
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="relative shrink-0 h-20 lg:h-24 w-auto min-w-[100px] max-w-[200px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="200px"
                className="object-contain brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Parallax Grid ──────────────────────────────────────────────────────────

function ParallaxGrid({
  tiles,
  marqueeSpeed = 30,
}: {
  tiles: CategoryVenuesTileData[];
  marqueeSpeed?: number;
}) {
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
        <ParallaxTile
          key={tile.label}
          {...tile}
          y={reduced ? zero : i % 2 === 0 ? yEven : yOdd}
          marqueeSpeed={marqueeSpeed}
        />
      ))}
    </div>
  );
}

// ── Parallax Tile ──────────────────────────────────────────────────────────

function ParallaxTile({
  src,
  label,
  labelAlign,
  description,
  href,
  logos,
  y,
  marqueeSpeed = 30,
}: CategoryVenuesTileData & { y: MotionValue<number>; marqueeSpeed?: number }) {
  const content = (
    <>
      <div className="absolute inset-0 overflow-hidden border border-sf-border/50">
        <motion.div
          className="absolute inset-x-0 top-[-18%] h-[136%] will-change-transform"
          style={{ y }}
        >
          <Image
            src={src}
            alt={label}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover scale-100 transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div
        className={cn(
          "absolute flex max-w-[420px] flex-col gap-3 p-6 lg:p-8",
          labelAlign === "top-left"
            ? "left-0 top-0 items-start text-left"
            : "bottom-0 right-0 items-end text-right",
        )}
      >
        <span className="font-syne text-[clamp(2rem,4vw,48px)] font-extrabold uppercase leading-none text-white transition-all duration-300 group-hover:[filter:drop-shadow(0_0_6px_#fff)_drop-shadow(0_0_3px_#f5f)]">
          {label}
        </span>
      </div>
      <LogoMarquee
        logos={logos}
        position={labelAlign === "top-left" ? "bottom" : "top"}
        direction={labelAlign === "top-left" ? "left" : "right"}
        speed={marqueeSpeed}
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group relative block aspect-[645/614] overflow-hidden">
        {content}
      </Link>
    );
  }

  return (
    <div className="group relative aspect-[645/614] overflow-hidden">
      {content}
    </div>
  );
}
