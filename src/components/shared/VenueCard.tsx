import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Venue } from "@/generated/prisma/client";

const FALLBACK = "/home/hero.png";

/**
 * Venue tile: centered logo over the venue image; on hover a transparent-black
 * inset box reveals the venue name + description. Links to the detail page.
 */
export function VenueCard({
  venue,
  disableHoverOverlay = false,
}: {
  venue: Venue;
  /** Skip the name/logo/description reveal on hover — just the image + centered logo. */
  disableHoverOverlay?: boolean;
}) {
  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="group relative block aspect-square w-full overflow-hidden border border-sf-border/40"
    >
      <Image
        src={venue.image ?? FALLBACK}
        alt={venue.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Subtle constant overlay so the centered logo stays legible */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Logo — centered, hidden on hover */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-10 transition-opacity duration-300",
          !disableHoverOverlay && "group-hover:opacity-0",
        )}
      >
        {venue.logo ? (
          <div className="relative h-24 w-[58%] lg:h-32">
            <Image src={venue.logo} alt={venue.name} fill sizes="(max-width: 768px) 58vw, 29vw" className="object-contain" />
          </div>
        ) : (
          <span className="text-center font-syne text-[clamp(1.5rem,2.5vw,32px)] font-bold leading-tight text-white">
            {venue.name}
          </span>
        )}
      </div>

      {/* Hover overlay: dark wash + inset bordered box, name (top) / logo (middle) / description (bottom) */}
      {!disableHoverOverlay ? (
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-5 flex flex-col items-center justify-between gap-6 border border-white/15 bg-black/75 px-8 py-12 text-center">
            <h3 className="font-syne text-[clamp(1.5rem,2.5vw,32px)] font-bold leading-tight text-white">
              {venue.name}
            </h3>
            {venue.logo ? (
              <div className="relative h-20 w-[55%] lg:h-24">
                <Image src={venue.logo} alt="" fill sizes="(max-width: 768px) 55vw, 27vw" className="object-contain" />
              </div>
            ) : null}
            <p className="font-inter text-sm leading-relaxed lg:text-base">
              {venue.description}
            </p>
          </div>
        </div>
      ) : null}
    </Link>
  );
}
