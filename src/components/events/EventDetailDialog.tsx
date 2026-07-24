"use client";

import Link from "next/link";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { whatsappHref } from "@/lib/whatsapp";
import { formatOccurrenceDateTime, type EventOccurrence } from "@/lib/event-calendar";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLE } from "./category-style";

/**
 * Detail modal for a single calendar occurrence. The date shown is the day that
 * was clicked — not the event's `startDate` — so a recurring event reads
 * correctly on each of its weekdays.
 */
export function EventDetailDialog({
  occurrence,
  whatsapp,
  onClose,
}: {
  occurrence: EventOccurrence | null;
  /** Site-wide fallback number when the event has no `waPhone` of its own. */
  whatsapp?: string;
  onClose: () => void;
}) {
  const style = occurrence ? CATEGORY_STYLE[occurrence.category] : null;
  const event = occurrence?.event;

  const phone = event?.waPhone ?? whatsapp ?? "";
  const waHref =
    event && phone
      ? whatsappHref(
          phone,
          `Hi SwillFam, I'd like to know more about ${event.name} on ${formatOccurrenceDateTime(
            occurrence.date,
            event.startHour,
          )}.`,
        )
      : null;

  const categoryAndVenue = event
    ? [event.categoryName, event.venueName].filter(Boolean).join(" + ")
    : "";

  return (
    <Dialog open={occurrence !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        overlayClassName="backdrop-blur-sm"
        className="max-h-[85dvh] gap-0 overflow-y-auto overflow-x-hidden border-sf-border/60 bg-sf-deep p-6 text-white shadow-[0_0_20px_rgba(255,255,255,0.16)] sm:max-w-[560px]"
      >
        {occurrence && event && style && (
          <>
            <DialogTitle className="pr-8 font-syne text-2xl font-bold leading-tight text-white">
              {event.name}
            </DialogTitle>

            {/* Category badge — colour-matched to the calendar chip */}
            <div
              className="mt-5 border-l-[3px] bg-white/[0.07] px-4 py-3"
              style={{ borderLeftColor: style.color }}
            >
              <span className="font-inter text-sm text-white">{style.badgeLabel}</span>
            </div>

            {categoryAndVenue && (
              <h3 className="mt-5 font-syne text-xl font-bold leading-tight text-white">
                {categoryAndVenue}
              </h3>
            )}

            <div className="mt-5">
              <p className="font-syne text-base font-bold text-white">Description</p>
              {/* Doubles as the dialog's accessible description for Radix. */}
              <DialogDescription className="mt-2 font-inter text-sm leading-relaxed text-white">
                {event.shortDescription}
              </DialogDescription>
            </div>

            <div className="mt-5">
              <p className="font-syne text-base font-bold text-white">Date &amp; Time</p>
              <p className="mt-2 font-inter text-sm text-white">
                {formatOccurrenceDateTime(occurrence.date, event.startHour)}
              </p>
            </div>

            <div className={cn("mt-6 gap-3", waHref ? "grid grid-cols-2" : "flex")}>
              {waHref && (
                  <Button
                    asChild
                    variant="swillfam"
                    size="pill"
                    className="w-full gap-2 font-inter"
                  >
                    <a href={waHref} target="_blank" rel="noopener noreferrer">
                      Inquiry
                      <WhatsappLogo weight="regular" className="size-5" />
                    </a>
                  </Button>
              )}
              <Button
                asChild
                variant="swillfam"
                size="pill"
                className={cn(
                  "font-inter",
                  waHref ? "w-full" : "w-fit",
                )}
              >
                <Link href={`/events/${event.slug}`}>View Event</Link>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
