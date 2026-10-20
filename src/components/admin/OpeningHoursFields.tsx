"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  WEEKDAY_OPTIONS,
  formatOpeningHours,
  type OpeningHoursRow,
} from "@/lib/opening-hours";

type Row = { days: string[]; opens: string; closes: string };

/**
 * Repeating opening-hours rows — one row per group of days that share the same
 * open/close pair, which is the shape `OpeningHoursSpecification` wants.
 *
 * Posts the whole set as JSON in a single hidden `hours` field rather than
 * indexed input names, following `ImageManager`'s precedent of a JSON control
 * field: no index bookkeeping to get wrong when a middle row is removed.
 *
 * The preview underneath is the real `formatOpeningHours` output, not a mock-up,
 * so what the admin reads here is literally what the venue page will say.
 */
export function OpeningHoursFields({
  name = "hours",
  existing = [],
  fallback,
}: {
  name?: string;
  existing?: OpeningHoursRow[];
  /** The free-text `operatingHours` still used while there are no rows. */
  fallback?: string;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    existing.map((row) => ({
      days: [...row.days],
      opens: row.opens,
      closes: row.closes,
    })),
  );

  const update = (index: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const toggleDay = (index: number, day: string) =>
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              days: row.days.includes(day)
                ? row.days.filter((d) => d !== day)
                : [...row.days, day],
            }
          : row,
      ),
    );

  const preview = formatOpeningHours(rows);

  return (
    <div className="grid gap-1.5">
      <Label>Opening hours</Label>

      <div className="space-y-3 rounded-md border bg-muted/40 p-4">
        {rows.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No structured hours yet — the venue page shows the free-text Operating hours field
            above. Add a row to drive both the page and the schema from the same data.
          </p>
        ) : (
          rows.map((row, index) => (
            <div key={index} className="space-y-2 rounded-md border bg-background p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {WEEKDAY_OPTIONS.map((day) => (
                    <Label
                      key={day.value}
                      htmlFor={`${name}-${index}-${day.value}`}
                      className="cursor-pointer rounded-md border px-3 py-1.5 font-normal"
                    >
                      <Checkbox
                        id={`${name}-${index}-${day.value}`}
                        checked={row.days.includes(day.value)}
                        onCheckedChange={() => toggleDay(index, day.value)}
                      />
                      {day.label}
                    </Label>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove hours row ${index + 1}`}
                  onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="flex items-end gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor={`${name}-${index}-opens`} className="text-xs">
                    Opens
                  </Label>
                  <Input
                    id={`${name}-${index}-opens`}
                    type="time"
                    className="w-32"
                    value={row.opens}
                    onChange={(e) => update(index, { opens: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`${name}-${index}-closes`} className="text-xs">
                    Closes
                  </Label>
                  <Input
                    id={`${name}-${index}-closes`}
                    type="time"
                    className="w-32"
                    value={row.closes}
                    onChange={(e) => update(index, { closes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setRows((prev) => [...prev, { days: [], opens: "", closes: "" }])}
        >
          <Plus className="size-4" />
          Add hours row
        </Button>
      </div>

      <input type="hidden" name={name} value={JSON.stringify(rows)} />

      <div className="text-xs text-muted-foreground">
        <span className="font-medium">The venue page will show:</span>
        <pre className="mt-1 whitespace-pre-line font-sans">
          {preview || fallback || "—"}
        </pre>
        {!preview && fallback ? (
          <span>From the free-text Operating hours field, because there are no rows yet.</span>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        One row per group of days sharing the same hours. Closing after midnight stays on the
        opening day — Friday 21:00 to 03:00 is one row, not two.
      </p>
    </div>
  );
}
