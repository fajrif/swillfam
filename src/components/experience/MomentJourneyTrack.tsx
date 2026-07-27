"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@phosphor-icons/react/ssr";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { cn } from "@/lib/utils";

export type MomentStep = {
  period: string;
  tagline: string;
  title: string;
  time: string;
  tags: string;
  cta: string;
  image: string;
};

/** Keeps the stroke clear of the track's left/right edges so it never clips. */
const RAIL_INSET = 14;
/** Stops the entry/exit tails short of the track's top/bottom edges, so the
 *  route keeps a margin on all four sides rather than running edge to edge. */
const TAIL_INSET = 40;
/** Tailwind's `lg`. Below it the serpentine is unreadable, so the path falls back
 *  to one straight rail — keyed off the viewport (not the track) so the path and
 *  the `lg:` row layout always switch on the same pixel. */
const LG_BREAKPOINT = 1024;
const NARROW_RAIL_X = 18;

const ARROW_COLOR = "#e0c88c";

/** Scroll spent travelling between two steps, vs parked on one. */
const MOVE_WEIGHT = 2;
const HOLD_WEIGHT = 1;
/** Fraction of a move spent rotating into/out of the parked heading. */
const TURN_RAMP = 0.28;

type Geometry = { width: number; height: number; centers: number[]; narrow: boolean };

type Journey = {
  d: string;
  /** Where each step sits on the path, as a fraction of its total length. */
  markers: number[];
};

/** Where the arrow faces while parked on a step — in toward that step's content. */
function inwardAngle(index: number, narrow: boolean) {
  if (narrow) return 0; // single left rail: always face the content
  return index % 2 === 0 ? 0 : 180; // left rail faces right, right rail faces left
}

/** Shortest-arc interpolation, so 350° → 10° goes forward 20° not back 340°. */
function lerpAngle(from: number, to: number, t: number) {
  return from + (((to - from + 540) % 360) - 180) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Serpentine through every row: the horizontal runs sit on the boundaries
 * *between* rows, so each turn is centred on a row and its apex lands exactly
 * where that row's step marker sits. Radii come from the measured gaps, so
 * equal-height rows produce true semicircles and unequal ones degrade to
 * ellipses rather than breaking alignment.
 *
 * Marker offsets are accumulated as the path is built (arc length = r × angle)
 * and returned as fractions of the total, so they stay correct however the
 * measured geometry scales.
 */
function buildJourneyPath(g: Geometry): Journey {
  const { width, height, centers, narrow } = g;
  if (centers.length < 3) return { d: "", markers: [] };
  if (narrow) {
    const span = height - TAIL_INSET * 2;
    return {
      d: `M ${NARROW_RAIL_X} ${TAIL_INSET} V ${height - TAIL_INSET}`,
      markers: centers.map((cy) => (cy - TAIL_INSET) / span),
    };
  }

  const LX = RAIL_INSET;
  const RX = width - RAIL_INSET;
  const bounds = centers.slice(0, -1).map((cy, i) => (cy + centers[i + 1]) / 2);

  // Entry: down the left rail, then a quarter turn out onto the first run.
  const entryR = bounds[0] - centers[0];
  const d = [
    `M ${LX} ${TAIL_INSET}`,
    `V ${centers[0]}`,
    `A ${entryR} ${entryR} 0 0 0 ${LX + entryR} ${bounds[0]}`,
  ];

  let cursorX = LX + entryR;
  let len = centers[0] - TAIL_INSET;
  const markers = [len]; // row 0's marker: the foot of the entry rail
  len += (Math.PI / 2) * entryR;

  for (let i = 1; i < centers.length - 1; i++) {
    const r = (bounds[i] - bounds[i - 1]) / 2;
    const right = i % 2 === 1;
    const x = right ? RX - r : LX + r;
    // sweep 1 = clockwise on screen, because SVG's y axis points down
    d.push(`H ${x}`, `A ${r} ${r} 0 0 ${right ? 1 : 0} ${x} ${bounds[i]}`);

    len += Math.abs(x - cursorX);
    markers.push(len + (Math.PI * r) / 2); // apex, halfway round the turn
    len += Math.PI * r;
    cursorX = x;
  }

  // Exit: quarter turn back onto whichever rail the last row uses, then down.
  const last = centers.length - 1;
  const exitR = centers[last] - bounds[bounds.length - 1];
  const exitLeft = last % 2 === 0;
  const exitX = exitLeft ? LX + exitR : RX - exitR;
  d.push(
    `H ${exitX}`,
    `A ${exitR} ${exitR} 0 0 ${exitLeft ? 0 : 1} ${exitLeft ? LX : RX} ${centers[last]}`,
    `V ${height - TAIL_INSET}`,
  );

  len += Math.abs(exitX - cursorX) + (Math.PI / 2) * exitR;
  markers.push(len);
  const total = len + (height - TAIL_INSET - centers[last]);

  return { d: d.join(" "), markers: markers.map((m) => m / total) };
}

type JourneyPoint = {
  /** Position along the path, 0–1. */
  fraction: number;
  /** Heading to settle into once parked. */
  facing: number;
  /** 1 = fully parked (use `facing`), 0 = mid-move (use the path tangent). */
  blend: number;
};

/**
 * Maps scroll progress to the arrow's state through alternating phases —
 * hold, move, hold, move, … — so it dwells on each step for a real stretch of
 * scrolling before setting off again. Five steps gives nine phases (five holds,
 * four moves). Purely a function of progress, so scrolling back up rewinds
 * through the same dwells.
 */
function journeyAt(t: number, markers: number[], narrow: boolean): JourneyPoint {
  const last = markers.length - 1;
  if (markers.length < 2) {
    return { fraction: markers[0] ?? 0, facing: inwardAngle(0, narrow), blend: 1 };
  }

  const phases = markers.length * 2 - 1;
  const totalWeight = last * MOVE_WEIGHT + markers.length * HOLD_WEIGHT;
  let cursor = Math.min(Math.max(t, 0), 1) * totalWeight;

  for (let phase = 0; phase < phases; phase++) {
    const parked = phase % 2 === 0;
    const weight = parked ? HOLD_WEIGHT : MOVE_WEIGHT;

    if (cursor > weight && phase < phases - 1) {
      cursor -= weight;
      continue;
    }

    if (parked) {
      const step = phase / 2;
      return { fraction: markers[step], facing: inwardAngle(step, narrow), blend: 1 };
    }

    const step = (phase - 1) / 2;
    const u = Math.min(Math.max(cursor / weight, 0), 1);
    // Rotate out of the parked heading as it sets off and back into the next
    // one on arrival; follow the path tangent for the stretch in between.
    const blend =
      u < TURN_RAMP
        ? 1 - u / TURN_RAMP
        : u > 1 - TURN_RAMP
          ? (u - (1 - TURN_RAMP)) / TURN_RAMP
          : 0;

    return {
      fraction: markers[step] + (markers[step + 1] - markers[step]) * easeInOutCubic(u),
      facing: inwardAngle(u < 0.5 ? step : step + 1, narrow),
      blend,
    };
  }

  return { fraction: markers[last], facing: inwardAngle(last, narrow), blend: 1 };
}

/**
 * The scroll-driven journey: a generated serpentine path behind the five step
 * rows, with a single gold play arrow riding the curve. Lenis owns the real
 * scroll position site-wide, so framer-motion's `useScroll` already reads
 * Lenis-smoothed values — the arrow inherits that easing for free.
 */
export function MomentJourneyTrack({ steps }: { steps: MomentStep[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const lengthRef = useRef(0);
  // Mirrored into a ref so `paint` stays referentially stable across renders
  // (same technique SpecularButton uses to keep its rAF loop's deps empty).
  const journeyRef = useRef<{ markers: number[]; narrow: boolean }>({
    markers: [],
    narrow: false,
  });
  const reduced = useReducedMotion();

  const [geometry, setGeometry] = useState<Geometry | null>(null);

  // Markers land at ~2.5/26/50/74/97.5% of the path, so this range puts the
  // arrow on a step's marker just as that step reaches the middle of the
  // viewport — the journey reads in step with the content rather than ahead of it.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 33%", "end 67%"],
  });

  // Measure the laid-out rows rather than assuming a row height, so the line
  // tracks the content at any breakpoint and survives copy wrapping.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const box = el.getBoundingClientRect();
      const centers = rowRefs.current
        .filter((row): row is HTMLDivElement => row !== null)
        .map((row) => {
          const r = row.getBoundingClientRect();
          return r.top - box.top + r.height / 2;
        });

      setGeometry({
        width: box.width,
        height: box.height,
        centers,
        narrow: window.innerWidth < LG_BREAKPOINT,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [steps.length]);

  const { d, markers } = geometry ? buildJourneyPath(geometry) : { d: "", markers: [] };
  const narrow = geometry?.narrow ?? false;

  // getPointAtLength is imperative, so paint straight to the DOM instead of
  // re-rendering React on every scroll frame.
  const paint = useCallback((t: number) => {
    const path = progressRef.current;
    const arrow = arrowRef.current;
    const total = lengthRef.current;
    const journey = journeyRef.current;
    if (!path || !arrow || !total || journey.markers.length === 0) return;

    const { fraction, facing, blend } = journeyAt(t, journey.markers, journey.narrow);
    const at = total * fraction;
    path.style.strokeDashoffset = `${total - at}`;

    // Sample either side so the tangent stays defined at both extremes —
    // clamping only forward leaves a zero-length vector at the very end.
    const behind = path.getPointAtLength(Math.max(at - 1, 0));
    const ahead = path.getPointAtLength(Math.min(at + 1, total));
    const point = path.getPointAtLength(at);
    const tangent = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
    const angle = lerpAngle(tangent, facing, blend);

    arrow.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%) rotate(${angle}deg)`;
  }, []);

  // Re-derive the path length whenever geometry changes, then paint once so a
  // mid-page reload lands at the right point instead of back at step one.
  useEffect(() => {
    const path = progressRef.current;
    if (!path || !d) return;

    journeyRef.current = { markers, narrow };
    lengthRef.current = path.getTotalLength();
    path.style.strokeDasharray = `${lengthRef.current}`;
    paint(reduced ? 0 : scrollYProgress.get());

    // Reduced motion: whole route drawn, arrow parked on step one.
    if (reduced) {
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
    }
  }, [d, markers, narrow, reduced, paint, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (t) => {
    if (!reduced) paint(t);
  });

  return (
    <div ref={trackRef} className="relative mx-auto mt-12 w-full max-w-[860px] lg:mt-16">
      {geometry && d ? (
        <>
          <svg
            width={geometry.width}
            height={geometry.height}
            className="pointer-events-none absolute left-0 top-0"
            aria-hidden
          >
            <defs>
              <linearGradient
                id="moment-journey-gradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2={geometry.height}
              >
                {/* Fading via stop-opacity on the same hue — fading straight to
                    `transparent` washes through grey on the way out. */}
                <stop offset="0%" stopColor="#4c1724" stopOpacity={0} />
                <stop offset="25%" stopColor="#4c1724" />
                <stop offset="50%" stopColor="#7e2237" />
                <stop offset="75%" stopColor="#4c1724" />
                <stop offset="100%" stopColor="#4c1724" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="moment-journey-gradient-lit"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2={geometry.height}
              >
                <stop offset="0%" stopColor="#a83450" stopOpacity={0} />
                <stop offset="25%" stopColor="#a83450" />
                <stop offset="50%" stopColor="#c8506e" />
                <stop offset="75%" stopColor="#a83450" />
                <stop offset="100%" stopColor="#a83450" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* The whole route, always visible. */}
            <path
              d={d}
              fill="none"
              stroke="url(#moment-journey-gradient)"
              strokeWidth={10}
              strokeLinecap="round"
            />
            {/* Travelled portion, lit up behind the arrow. */}
            <path
              ref={progressRef}
              d={d}
              fill="none"
              stroke="url(#moment-journey-gradient-lit)"
              strokeWidth={10}
              strokeLinecap="round"
            />
          </svg>

          <div
            ref={arrowRef}
            className="pointer-events-none absolute left-0 top-0 will-change-transform"
            aria-hidden
          >
            <PlayIcon
              weight="fill"
              className="size-10 lg:size-12"
              style={{
                color: ARROW_COLOR,
                filter: "drop-shadow(0 0 12px rgba(224, 200, 140, 0.55))",
              }}
            />
          </div>
        </>
      ) : null}

      {steps.map((step, i) => {
        const right = i % 2 === 1;

        return (
          <div
            key={step.title}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className={cn(
              // Mobile stacks image over text, which overruns any fixed height —
              // so the row sizes to its content and `py-10` keeps consecutive
              // steps apart. The serpentine only needs equal heights at `lg`,
              // where the turn radii come from the gaps between row centres.
              "relative z-10 flex items-center py-10 lg:h-[320px] lg:py-0",
              right ? "lg:justify-end" : "lg:justify-start",
            )}
          >
            <div
              // Hugs the rail its row turns on with only a small gap, so the
              // line wraps tight around the thumbnail instead of drifting away.
              // Kept narrow so both rows' text lands in the same centre band.
              className={cn(
                "flex w-full flex-col items-start gap-4 pl-14",
                "lg:max-w-[640px] lg:flex-row lg:items-center lg:gap-8",
                right ? "lg:flex-row-reverse lg:pl-0 lg:pr-[56px]" : "lg:pl-[56px] lg:pr-0",
              )}
            >
              <Image
                src={step.image}
                alt={step.title}
                width={206}
                height={206}
                className="size-[120px] shrink-0 object-cover lg:size-[200px]"
              />

              <div
                className={cn(
                  "flex flex-col gap-2",
                  right ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left",
                )}
              >
                <p className="font-inter text-sm uppercase tracking-wide text-white">
                  <span className="font-bold">{step.period}</span>
                  <span className="font-normal normal-case"> – {step.tagline}</span>
                </p>
                <h3 className="font-syne text-xl text-white lg:text-2xl">{step.title}</h3>
                <p className="font-inter text-base text-white">{step.time}</p>
                <p className="font-inter text-sm text-white mb-2">{step.tags}</p>
                <SpecularButton type="button" size="sm" className="my-2 w-[200px]">
                  {step.cta}
                </SpecularButton>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
