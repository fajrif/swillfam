import { PlayIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

/** Shared collapse indicator: a play-triangle that rotates 90° open. Pass `open` for
 *  hand-rolled toggles; omit it when a CSS `data-state` selector drives the rotation instead.
 *  Uses the bundled `@phosphor-icons/react` SVG (not the unpinned webfont CDN script in
 *  layout.tsx), so it can never fail to load. */
export function CollapseArrow({ open, className }: { open?: boolean; className?: string }) {
  return (
    <PlayIcon
      className={cn(
        "size-6 shrink-0 text-sf-body/40 transition-transform duration-200",
        open && "rotate-90",
        className
      )}
      aria-hidden
    />
  );
}
