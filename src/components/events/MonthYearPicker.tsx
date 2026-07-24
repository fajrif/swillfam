"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONTH_NAMES } from "@/lib/event-calendar";

/** Abbreviated month labels for the 3x4 grid. */
const SHORT_MONTHS = MONTH_NAMES.map((m) => m.slice(0, 3));

/**
 * Small panel opened by the "June 2026" label: a year stepper above a month
 * grid. Closes on select, outside click, or Escape.
 *
 * shadcn's `popover` isn't installed in this project, and a month picker is
 * neither a dialog, form, table, nor input — so this stays a purpose-built
 * panel rather than pulling in a new primitive.
 */
export function MonthYearPicker({
  year,
  month,
  onSelect,
  onClose,
}: {
  year: number;
  month: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}) {
  const [draftYear, setDraftYear] = useState(year);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // Deferred so the click that opened the panel doesn't immediately close it.
    const id = window.setTimeout(() => document.addEventListener("mousedown", onPointerDown));
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Select month and year"
      className="absolute right-0 top-[calc(100%+8px)] z-50 w-[264px] border border-sf-border/60 bg-sf-surface p-4 shadow-xl"
    >
      {/* Year stepper */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous year"
          onClick={() => setDraftYear((y) => y - 1)}
          className="cursor-pointer border border-sf-border/60 p-1.5 text-white transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="font-syne text-lg font-bold text-white">{draftYear}</span>
        <button
          type="button"
          aria-label="Next year"
          onClick={() => setDraftYear((y) => y + 1)}
          className="cursor-pointer border border-sf-border/60 p-1.5 text-white transition-colors hover:bg-white/10"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Month grid */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {SHORT_MONTHS.map((label, i) => {
          const isCurrent = draftYear === year && i === month;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(draftYear, i)}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "cursor-pointer px-2 py-2 font-inter text-sm transition-colors",
                isCurrent
                  ? "bg-sf-accent text-white"
                  : "text-white hover:bg-white/10",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
