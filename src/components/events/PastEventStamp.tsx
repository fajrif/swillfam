import { cn } from "@/lib/utils";

/**
 * "Past Event" marker shown on the detail page of a deactivated event.
 *
 * Styled as a rubber stamp rather than a chip — double rule, wide tracking, and
 * a slight rotation — so it reads as something applied over the page instead of
 * another piece of UI chrome.
 */
export function PastEventStamp({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex -rotate-[4deg] select-none items-center border-2 border-double border-white/50 px-4 py-1.5",
        "font-syne text-xs font-bold uppercase tracking-[0.28em] text-white/80",
        className,
      )}
    >
      Past Event
    </span>
  );
}
