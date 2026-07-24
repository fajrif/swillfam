"use client";

import { useSyncExternalStore } from "react";
import { Container } from "@/components/shared/Container";
import { ReserveButton } from "./ReserveButton";

/** Re-render every second. One interval per mounted countdown. */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

/**
 * Whole seconds since the epoch — stable within a tick, so React's snapshot
 * comparison settles instead of looping.
 */
function getSnapshot() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Server snapshot. Returning `null` renders placeholders during SSR and
 * hydration, which is deliberate: the server and the viewer's clock disagree, so
 * emitting a real duration server-side would guarantee a hydration mismatch.
 * `useSyncExternalStore` also keeps the ticking out of an effect body, which
 * this repo's `react-hooks/set-state-in-effect` rule forbids.
 */
function getServerSnapshot() {
  return null;
}

/** Break a positive second count into day/hour/minute/second parts. */
function split(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/**
 * "Countdown to the Event" — live time remaining until a fixed event starts.
 *
 * The caller only renders this for upcoming events, so it never has to explain
 * an elapsed date; if the clock runs past the start while the page is open it
 * simply settles on zeros.
 */
export function EventCountdown({
  targetIso,
  eventName,
  venueName,
  phone,
  active,
}: {
  /** ISO instant the event starts. */
  targetIso: string;
  eventName: string;
  venueName?: string | null;
  phone?: string | null;
  active: boolean;
}) {
  const nowSeconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const targetSeconds = Math.floor(new Date(targetIso).getTime() / 1000);
  const remaining = nowSeconds === null ? null : split(targetSeconds - nowSeconds);

  // Days only appear once the event is more than a day out, so an imminent event
  // reads as the three-unit countdown in the design.
  const units: { label: string; value: number | null }[] = [
    ...(remaining === null || remaining.days > 0
      ? [{ label: "Days", value: remaining?.days ?? null }]
      : []),
    { label: "Hours", value: remaining?.hours ?? null },
    { label: "Minutes", value: remaining?.minutes ?? null },
    { label: "Seconds", value: remaining?.seconds ?? null },
  ];

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="flex max-w-[640px] flex-col gap-4">
          <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
            Countdown to the Event
          </h2>
          <p className="font-inter leading-relaxed text-white">
            The countdown is on. Reserve your spot and get ready for {eventName}
            {venueName ? ` at ${venueName}` : ""}.
          </p>
        </div>

        <div className="flex flex-wrap items-stretch justify-center gap-6 border border-sf-border/40 bg-sf-surface p-8 shadow-xl shadow-sf-accent/30 lg:gap-16 lg:p-16 mb-6">
          {units.map((unit) => (
            <div key={unit.label} className="flex min-w-[90px] flex-col items-center gap-2">
              <span className="font-syne text-[clamp(2.75rem,7vw,84px)] font-bold leading-none tabular-nums text-white">
                {unit.value === null ? "--" : String(unit.value).padStart(2, "0")}
              </span>
              <span className="font-inter text-sm text-white">{unit.label}</span>
            </div>
          ))}
        </div>

        <ReserveButton
          eventName={eventName}
          venueName={venueName}
          phone={phone}
          active={active}
          className="items-center"
        />
      </Container>
    </section>
  );
}
