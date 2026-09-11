import type { ReactNode } from "react";
import type { Venue } from "@/generated/prisma/client";
import { ImageLightbox } from "./ImageLightbox";

type VenueWithCategory = Venue & { category: { name: string } | null };

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
          <Info label="Operating hours" value={venue.operatingHours} />
          <Info label="Hero title" value={venue.heroTitle} />
          <Info label="Caption" value={venue.caption} />
        </div>
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
          <Info label="Latitude" value={venue.lat?.toString()} />
          <Info label="Longitude" value={venue.lng?.toString()} />
          <Info label="Google Maps Place ID" value={venue.placeId} />
          <Info label="WhatsApp" value={venue.whatsapp} />
          <Info label="Phone" value={venue.phone} />
          <Info label="Email" value={venue.email} />
        </div>
      </Section>

      <Section title="Media embeds">
        <Info label="Spotify" value={venue.spotifyEmbed} code />
        <Info label="YouTube" value={venue.youtubeEmbed} code />
        <Info label="Instagram" value={venue.instagramEmbed} code />
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
}: {
  label: string;
  value: ReactNode;
  /** Keep the admin's line breaks (long text fields). */
  multiline?: boolean;
  /** Raw embed markup: monospace, clamped to two lines. */
  code?: boolean;
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
