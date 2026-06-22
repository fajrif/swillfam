"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WEEKDAYS: { value: string; label: string }[] = [
  { value: "MONDAY", label: "Mon" },
  { value: "TUESDAY", label: "Tue" },
  { value: "WEDNESDAY", label: "Wed" },
  { value: "THURSDAY", label: "Thu" },
  { value: "FRIDAY", label: "Fri" },
  { value: "SATURDAY", label: "Sat" },
  { value: "SUNDAY", label: "Sun" },
];

/** Event schedule block: toggles between a fixed date and a recurring weekday pattern. */
export function EventScheduleFields({
  defaultEventType = "FIXED",
  defaultStartDate = "",
  defaultEndDate = "",
  defaultStartHour = "",
  defaultEndHour = "",
  defaultRecurringDays = [],
}: {
  defaultEventType?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultStartHour?: string;
  defaultEndHour?: string;
  defaultRecurringDays?: string[];
}) {
  const [eventType, setEventType] = useState(defaultEventType);
  const recurring = eventType === "RECURRING";

  return (
    <div className="space-y-4 rounded-md border bg-muted/40 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="eventType">Schedule type</Label>
          <Select name="eventType" value={eventType} onValueChange={setEventType}>
            <SelectTrigger id="eventType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIXED">Fixed date</SelectItem>
              <SelectItem value="RECURRING">Recurring (weekly)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="startDate">
            {recurring ? "Recurrence starts" : "Event date"} <span className="text-destructive">*</span>
          </Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={defaultStartDate} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="endDate">{recurring ? "Recurrence ends" : "End date (optional)"}</Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={defaultEndDate} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="startHour">
            Start time <span className="text-destructive">*</span>
          </Label>
          <Input id="startHour" name="startHour" type="time" defaultValue={defaultStartHour} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="endHour">
            End time <span className="text-destructive">*</span>
          </Label>
          <Input id="endHour" name="endHour" type="time" defaultValue={defaultEndHour} required />
        </div>
      </div>

      {recurring && (
        <div className="grid gap-1.5">
          <Label>Repeats on</Label>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((d) => (
              <Label
                key={d.value}
                htmlFor={`day-${d.value}`}
                className="cursor-pointer rounded-md border bg-background px-3 py-1.5 font-normal"
              >
                <Checkbox
                  id={`day-${d.value}`}
                  name="recurringDays"
                  value={d.value}
                  defaultChecked={defaultRecurringDays.includes(d.value)}
                />
                {d.label}
              </Label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Pick one or more days (e.g. every Friday &amp; Saturday).</p>
        </div>
      )}
    </div>
  );
}
