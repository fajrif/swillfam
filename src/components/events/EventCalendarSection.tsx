"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { DropdownIcons, type DropdownIconOption } from "@/components/shared/DropdownIcons";
import { cn } from "@/lib/utils";
import {
  buildMonthGrid,
  buildOccurrenceMap,
  categoryOf,
  formatMonthYear,
  type CalendarEvent,
  type EventCategoryKind,
  type EventOccurrence,
} from "@/lib/event-calendar";
import { CATEGORY_ORDER, CATEGORY_STYLE } from "./category-style";
import { EventCalendarGrid } from "./EventCalendarGrid";
import { EventDetailDialog } from "./EventDetailDialog";
import { MonthYearPicker } from "./MonthYearPicker";

/**
 * "Event Calendar" — a monthly grid of every event, colour-coded by category.
 *
 * The three toggles double as the legend: all are on by default and each one
 * hides or shows its own category. Because `categoryOf` assigns every event to
 * exactly one category, nothing is ever drawn twice.
 */
export function EventCalendarSection({
  events,
  venues,
  whatsapp,
  todayKey,
}: {
  events: CalendarEvent[];
  /** Powers the venue filter dropdown — defaults to the first (alphabetically first from the DB). */
  venues: { id: string; slug: string; name: string; logo: string | null }[];
  whatsapp?: string;
  /** `YYYY-MM-DD` for today, from the server — also seeds the initial month. */
  todayKey: string;
}) {
  const [initialYear, initialMonth] = todayKey.split("-").map(Number);
  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth - 1);
  const [active, setActive] = useState<Set<EventCategoryKind>>(() => new Set(CATEGORY_ORDER));
  const [venueId, setVenueId] = useState<string | null>(() => venues[0]?.id ?? null);
  const [selected, setSelected] = useState<EventOccurrence | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const venueOptions: DropdownIconOption[] = venues.map((v) => ({
    value: v.id,
    label: v.name,
    image: v.logo,
  }));

  const grid = buildMonthGrid(viewYear, viewMonth);
  const occurrences = buildOccurrenceMap(
    events.filter(
      (e) => (venueId === null || e.venueId === venueId) && active.has(categoryOf(e)),
    ),
    grid,
  );

  function stepMonth(delta: number) {
    const next = new Date(Date.UTC(viewYear, viewMonth + delta, 1));
    setViewYear(next.getUTCFullYear());
    setViewMonth(next.getUTCMonth());
  }

  function toggleCategory(kind: EventCategoryKind) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }

  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-12">
        {/* Intro */}
        <div className="flex flex-col gap-5">
          <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
            Discover What&apos;s On and When
          </h2>
          <p className="font-inter leading-relaxed">
            A running record of every SwillFam night, sorted, dated, and easy to plan around.
          </p>

          {venueOptions.length > 0 && (
            <DropdownIcons options={venueOptions} value={venueId ?? ""} onValueChange={setVenueId} />
          )}
        </div>

        {/* Toolbar + grid */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category toggles (also the colour legend) */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_ORDER.map((kind) => {
                const style = CATEGORY_STYLE[kind];
                const isActive = active.has(kind);
                return (
                  <button
                    key={kind}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => toggleCategory(kind)}
                    style={isActive ? { borderColor: style.color } : undefined}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border bg-sf-surface px-4 py-2.5 font-inter text-sm transition-colors",
                      isActive
                        ? "text-white"
                        : "border-sf-border/60 text-white/50 hover:text-white",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full"
                      style={{ backgroundColor: style.color, opacity: isActive ? 1 : 0.4 }}
                    />
                    {style.toggleLabel}
                  </button>
                );
              })}
            </div>

            {/* Month navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => stepMonth(-1)}
                className="cursor-pointer border border-sf-border/60 bg-sf-surface p-2.5 text-white transition-colors hover:bg-white/10"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={pickerOpen}
                  onClick={() => setPickerOpen((open) => !open)}
                  className="min-w-[150px] cursor-pointer border border-sf-border/60 bg-sf-surface px-5 py-2.5 font-inter text-sm text-white transition-colors hover:bg-white/10"
                >
                  {formatMonthYear(viewYear, viewMonth)}
                </button>

                {pickerOpen && (
                  <MonthYearPicker
                    year={viewYear}
                    month={viewMonth}
                    onSelect={(y, m) => {
                      setViewYear(y);
                      setViewMonth(m);
                      setPickerOpen(false);
                    }}
                    onClose={() => setPickerOpen(false)}
                  />
                )}
              </div>

              <button
                type="button"
                aria-label="Next month"
                onClick={() => stepMonth(1)}
                className="cursor-pointer border border-sf-border/60 bg-sf-surface p-2.5 text-white transition-colors hover:bg-white/10"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <EventCalendarGrid
            grid={grid}
            occurrences={occurrences}
            month={viewMonth}
            todayKey={todayKey}
            onSelect={setSelected}
          />
        </div>
      </Container>

      <EventDetailDialog
        occurrence={selected}
        whatsapp={whatsapp}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
