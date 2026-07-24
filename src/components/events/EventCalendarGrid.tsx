"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  WEEKDAY_HEADERS,
  dateKey,
  formatHour,
  type EventOccurrence,
} from "@/lib/event-calendar";
import { CATEGORY_STYLE } from "./category-style";

/** Chips rendered before a day collapses the rest behind "+N more". */
const CHIP_LIMIT = 2;

/**
 * The month grid itself: a Monday-first header row over one cell per day, each
 * holding the day number and its event chips. Purely presentational — the month
 * and filtering are owned by `EventCalendarSection`.
 */
export function EventCalendarGrid({
  grid,
  occurrences,
  month,
  todayKey,
  onSelect,
}: {
  grid: Date[];
  occurrences: Map<string, EventOccurrence[]>;
  /** Month currently being viewed (0-indexed) — days outside it render dimmed. */
  month: number;
  /** `YYYY-MM-DD` for today, computed on the server to keep hydration stable. */
  todayKey: string;
  onSelect: (occurrence: EventOccurrence) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px] border-l border-t border-sf-border/40">
        {/* Weekday headers */}
        <div className="grid grid-cols-7">
          {WEEKDAY_HEADERS.map((label) => (
            <div
              key={label}
              className="border-b border-r border-sf-border/40 px-3 py-4 text-center font-inter text-sm font-medium text-white"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {grid.map((day) => {
            const key = dateKey(day);
            return (
              <DayCell
                key={key}
                day={day}
                occurrences={occurrences.get(key) ?? []}
                inMonth={day.getUTCMonth() === month}
                isToday={key === todayKey}
                isPast={key < todayKey}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayCell({
  day,
  occurrences,
  inMonth,
  isToday,
  isPast,
  onSelect,
}: {
  day: Date;
  occurrences: EventOccurrence[];
  inMonth: boolean;
  isToday: boolean;
  /** Whether this day is before today — the only thing that mutes its chips. */
  isPast: boolean;
  onSelect: (occurrence: EventOccurrence) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? occurrences : occurrences.slice(0, CHIP_LIMIT);
  const hidden = occurrences.length - shown.length;

  return (
    <div
      className={cn(
        "flex min-h-[124px] gap-2 border-b border-r border-sf-border/40 p-2",
        isToday && "bg-white/5 ring-1 ring-inset ring-white/40",
      )}
    >
      <span
        className={cn(
          "w-5 shrink-0 font-inter text-sm font-medium",
          inMonth ? "text-white" : "text-white/40",
        )}
      >
        {day.getUTCDate()}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {shown.map((occurrence) => (
          <EventChip key={occurrence.key} occurrence={occurrence} isPast={isPast} onSelect={onSelect} />
        ))}

        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="cursor-pointer text-left font-inter text-[11px] text-white underline-offset-2 hover:underline"
          >
            +{hidden} more
          </button>
        )}
      </div>
    </div>
  );
}

function EventChip({
  occurrence,
  isPast,
  onSelect,
}: {
  occurrence: EventOccurrence;
  isPast: boolean;
  onSelect: (occurrence: EventOccurrence) => void;
}) {
  const { event, category } = occurrence;
  return (
    <button
      type="button"
      onClick={() => onSelect(occurrence)}
      className={cn(
        "flex w-full cursor-pointer flex-col gap-0.5 border-l-[3px] px-2 py-1.5 text-left transition-colors",
        isPast ? "bg-white/[0.03] opacity-40" : "bg-white/[0.07] hover:bg-white/15",
      )}
      style={{ borderLeftColor: CATEGORY_STYLE[category].color }}
    >
      <span className="truncate font-inter text-xs font-medium text-white">{event.name}</span>
      <span className="font-inter text-[11px] text-white">{formatHour(event.startHour)}</span>
    </button>
  );
}
