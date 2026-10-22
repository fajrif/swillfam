import type { ReactNode } from "react";
import type { Venue, VenueHour } from "@/generated/prisma/client";
import { ImageLightbox } from "./ImageLightbox";
import { venueHoursText } from "@/lib/opening-hours";
import { VENUE_SCHEMA_TYPES } from "@/lib/schema-options";
import { googleMapsUrl } from "@/lib/maps";

type VenueWithCategory = Venue & {
  category: { name: string } | null;
  hours?: VenueHour[];
};

const SCHEMA_TYPE_LABEL = new Map<string, string>(
  VENUE_SCHEMA_TYPES.map((t) => [t.value, t.label]),
);

/** Read-only view of every venue field, grouped in the same order as `VenueForm`. */
export function VenueDetails({ venue }: { venue: VenueWithCategory }) {
  return (
    <div className="space-y-6">
      <Section title="Images">
        <div className="grid grid-cols-3 gap-6">
          <ImageSlot label="Image" src={venue.image} hint="Venue card in listings" />
          <ImageSlot label="Banner image" src={venue.bannerImage} hint="Banner on the venue page" />
          <ImageSlot label="Logo" src={venue.logo} contain />
        </div>
      </Section>

      <Section title="Overview">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Info label="Name" value={venue.name} />
          <Info
            label="Public page"
            value={
              <a
                href={`/venues/${venue.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 underline underline-offset-2 hover:text-zinc-600"
              >
                /venues/{venue.slug} ↗
              </a>
            }
          />
          <Info label="Category" value={venue.category?.name} />
          <Info
            label="Published"
            value={venue.published ? "Yes" : "No — hidden from the site, sitemap and search engines"}
          />
          <Info label="Hero title" value={venue.heroTitle} />
          <Info label="Caption" value={venue.caption} />
        </div>
        {/* The derived string, so this page shows what the venue page shows. */}
        <Info
          label="Operating hours"
          value={venueHoursText(venue.hours, venue.operatingHours)}
          multiline
          hint={
            venue.hours && venue.hours.length > 0
              ? "From the structured hours rows."
              : "From the free-text field — no structured rows yet."
          }
        />
        <Info label="Hero description" value={venue.heroDescription} multiline />
        <Info label="Description" value={venue.description} multiline />
      </Section>

      <Section title="Talent section">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Info label="Title" value={venue.talentSectionTitle} />
          <Info label="Description" value={venue.talentSectionDescription} />
        </div>
      </Section>

      <Section title="Location & contact">
        <Info label="Location / address" value={venue.location} />
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          <Info label="Street address" value={venue.streetAddress} />
          <Info label="Postal code" value={venue.postalCode} />
          <Info label="Google Maps Place ID" value={venue.placeId} />
          <Info label="Latitude" value={venue.lat?.toString()} />
          <Info label="Longitude" value={venue.lng?.toString()} />
          <Info
            label="Map link"
            value={
              <a
                href={googleMapsUrl(venue)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 underline underline-offset-2 hover:text-zinc-600"
              >
                Open in Google Maps ↗
              </a>
            }
            hint="Built from the Place ID, or coordinates as a fallback."
          />
          <Info label="WhatsApp" value={venue.whatsapp} />
          <Info label="Phone" value={venue.phone} />
          <Info label="Email" value={venue.email} />
        </div>
      </Section>

      <Section title="Search engine data">
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          <Info
            label="Venue type"
            value={venue.schemaTypes.map((t) => SCHEMA_TYPE_LABEL.get(t) ?? t).join(", ")}
          />
          <Info label="Cuisine" value={venue.cuisine} />
          <Info label="Instagram URL" value={venue.instagramUrl} />
        </div>
      </Section>

      <Section title="Media embeds">
        <Info label="Spotify" value={venue.spotifyEmbed} code />
        <Info label="YouTube" value={venue.youtubeEmbed} code />
      </Section>

      <Section title="SEO">
        <Info label="Meta title" value={venue.metaTitle} />
        <Info label="Meta description" value={venue.metaDescription} multiline />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{title}</h2>
      {children}
    </section>
  );
}

function Info({
  label,
  value,
  multiline,
  code,
  hint,
}: {
  label: string;
  value: ReactNode;
  /** Keep the admin's line breaks (long text fields). */
  multiline?: boolean;
  /** Raw embed markup: monospace, clamped to two lines. */
  code?: boolean;
  /** Where a derived value came from. */
  hint?: string;
}) {
  const empty = value === null || value === undefined || value === "";
  return (
    <div className="text-sm">
      <div className="text-zinc-500">{label}</div>
      {empty ? (
        <div className="text-zinc-400">—</div>
      ) : code ? (
        <code className="mt-1 block line-clamp-2 break-all bg-zinc-50 px-2 py-1 font-mono text-xs text-zinc-700">
          {value}
        </code>
      ) : (
        <div className={`font-medium text-zinc-900 break-words ${multiline ? "whitespace-pre-line" : ""}`}>
          {value}
        </div>
      )}
      {hint && !empty && <p className="mt-0.5 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

function ImageSlot({
  label,
  src,
  hint,
  contain,
}: {
  label: string;
  src: string | null;
  hint?: string;
  /** Logos are square artwork on black — show them whole rather than cropped. */
  contain?: boolean;
}) {
  return (
    <div className="space-y-1.5 text-sm">
      <div className="text-zinc-500">{label}</div>
      {src ? (
        <ImageLightbox
          src={src}
          alt={label}
          bgBlack={contain}
          className={`h-36 w-full border border-zinc-200 ${contain ? "object-contain" : ""}`}
        />
      ) : (
        <div className="flex h-36 items-center justify-center border border-dashed border-zinc-300 text-xs text-zinc-400">
          No image
        </div>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
