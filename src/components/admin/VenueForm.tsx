import type { Venue, VenueHour } from "@/generated/prisma/client";
import {
  Field,
  TextareaField,
  SelectField,
  CheckboxField,
  CheckboxGroupField,
  ReadOnlyField,
  SaveButton,
} from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";
import { SeoFields } from "./SeoFields";
import { OpeningHoursFields } from "./OpeningHoursFields";
import { VENUE_SCHEMA_TYPES } from "@/lib/schema-options";

const OPERATING_HOURS_PRESETS = [
  "Monday - Sunday: 12:00 - 03:00",
  "Monday - Friday: 17:00 - 02:00",
  "Tuesday - Sunday: 18:00 - 02:00",
  "Wednesday - Sunday: 19:00 - 04:00",
  "Friday - Saturday: 21:00 - 05:00",
  "Daily: 10:00 - 22:00",
];

export function VenueForm({
  action,
  venue,
  hours = [],
  categories,
  lockIdentity = false,
  altsByPath,
}: {
  action: (formData: FormData) => void;
  venue?: Venue;
  /** Structured opening hours, in `sortOrder`. */
  hours?: VenueHour[];
  categories: { id: string; name: string }[];
  /** Operators: slug (venue FAQs are keyed by it), category and Published are read-only. */
  lockIdentity?: boolean;
  /** Stored alt text by image path, from `getImageAltRecord()`. */
  altsByPath?: Record<string, string>;
}) {
  // Preserve a previously-saved custom value that isn't one of the presets.
  const hoursOptions = [...OPERATING_HOURS_PRESETS];
  if (venue?.operatingHours && !hoursOptions.includes(venue.operatingHours)) {
    hoursOptions.unshift(venue.operatingHours);
  }

  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-3 gap-6">
        <ImageManager altsByPath={altsByPath} name="image" label="Image" existing={venue?.image ? [venue.image] : []} hint="Shown on the venue card in listings." />
        <ImageManager altsByPath={altsByPath} name="bannerImage" label="Banner image" existing={venue?.bannerImage ? [venue.bannerImage] : []} hint="Shown as the banner on the venue page." />
        {/* No alt input: a logo's alt is the venue name, which the render sites
            already pass and nobody should have to retype. */}
        <ImageManager name="logo" label="Logo" existing={venue?.logo ? [venue.logo] : []} bgBlack alts={false} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={venue?.name} required hint=" " />
        {lockIdentity ? (
          <ReadOnlyField label="Slug" value={venue?.slug ?? ""} hint="Only administrators can change the URL." />
        ) : (
          <SlugField sourceName="name" defaultValue={venue?.slug} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {lockIdentity ? (
          <ReadOnlyField
            label="Category"
            value={categories.find((c) => c.id === venue?.categoryId)?.name ?? "—"}
            hint="Only administrators can change the category."
          />
        ) : (
          <SelectField
            label="Category"
            name="categoryId"
            defaultValue={venue?.categoryId ?? ""}
            blankLabel="— None —"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        )}
        <SelectField
          label="Operating hours (free text)"
          name="operatingHours"
          defaultValue={venue?.operatingHours}
          options={hoursOptions.map((h) => ({ value: h, label: h }))}
          hint="Fallback only — the structured rows below take over once filled in."
        />
      </div>

      <OpeningHoursFields existing={hours} fallback={venue?.operatingHours} />

      <Field label="Hero title" name="heroTitle" defaultValue={venue?.heroTitle ?? ""} hint="Big hero headline, e.g. “Izakaya Culture, Reimagined”. Falls back to Name if left blank." />
      <TextareaField label="Hero description" name="heroDescription" defaultValue={venue?.heroDescription ?? ""} rows={2} hint="Short paragraph shown under the hero title." />

      <Field label="Caption" name="caption" defaultValue={venue?.caption ?? ""} hint="Overview section title, e.g. “Tokyo Roots, Jakarta Table”." />
      <TextareaField label="Description" name="description" defaultValue={venue?.description} rows={4} required />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Talent section title" name="talentSectionTitle" defaultValue={venue?.talentSectionTitle ?? ""} hint="Team section heading, e.g. “Meet the Bar Team”. Falls back to “Meet the Team”." />
        <Field label="Talent section description" name="talentSectionDescription" defaultValue={venue?.talentSectionDescription ?? ""} hint="e.g. “The mixologists and bartenders behind every pour at Dualism.”" />
      </div>

      <Field label="Location / address" name="location" defaultValue={venue?.location} required hint="Shown on the page, e.g. “SCBD Lot 14, Jakarta Selatan”." />

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Street address"
          name="streetAddress"
          defaultValue={venue?.streetAddress ?? ""}
          hint="Street line only — the city, region and country are the same for every venue and are added automatically."
        />
        <Field label="Postal code" name="postalCode" defaultValue={venue?.postalCode ?? ""} placeholder="12190" hint=" " />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitude" name="lat" type="number" step="any" defaultValue={venue?.lat ?? ""} hint="For Google Maps" />
        <Field label="Longitude" name="lng" type="number" step="any" defaultValue={venue?.lng ?? ""} hint=" " />
      </div>
      <Field label="Google Maps Place ID" name="placeId" defaultValue={venue?.placeId ?? ""} hint="From maps embed URL (pb=!1m18...). Also builds the venue's map link for search engines." />

      <div className="grid grid-cols-3 gap-4">
        <Field label="WhatsApp" name="whatsapp" defaultValue={venue?.whatsapp ?? ""} hint="Phone number only (digits)" />
        <Field label="Phone" name="phone" defaultValue={venue?.phone ?? ""} />
        <Field label="Email" name="email" type="email" defaultValue={venue?.email ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Instagram URL"
          name="instagramUrl"
          type="url"
          defaultValue={venue?.instagramUrl ?? ""}
          placeholder="https://www.instagram.com/…"
          hint="The venue's own profile, not a post. Tells search engines this page and that account are the same place, and drives the Follow Us on Instagram feed on this venue's page."
        />
        <Field
          label="Cuisine"
          name="cuisine"
          defaultValue={venue?.cuisine ?? ""}
          placeholder="Japanese"
          hint="Restaurants and cafés only. Leave blank for bars and clubs."
        />
      </div>

      <CheckboxGroupField
        label="Venue type"
        name="schemaTypes"
        options={VENUE_SCHEMA_TYPES.map((t) => ({ value: t.value, label: t.label }))}
        defaultValues={venue?.schemaTypes ?? []}
        hint="How search engines classify this venue. Tick more than one where both apply — Kilo Jakarta is a restaurant and a bar."
      />

      <TextareaField label="Spotify embed" name="spotifyEmbed" defaultValue={venue?.spotifyEmbed ?? ""} rows={2} />
      <TextareaField label="YouTube embed" name="youtubeEmbed" defaultValue={venue?.youtubeEmbed ?? ""} rows={2} />

      {/* Publishing is a launch-level decision, so it sits with slug and
          category as administrator-only. Unpublishing is how Atsumaru stays off
          the site: it also drops the venue from the sitemap and the schema. */}
      {lockIdentity ? (
        <ReadOnlyField
          label="Published"
          value={venue?.published ? "Yes" : "No"}
          hint="Only administrators can publish or unpublish a venue."
        />
      ) : (
        <CheckboxField
          label="Published"
          name="published"
          defaultChecked={venue?.published ?? true}
          hint="Unticking hides the venue from the public site and removes it from the sitemap and search-engine data. Its events and promotions are kept."
        />
      )}

      <SeoFields
        titleValue={venue?.metaTitle}
        descriptionValue={venue?.metaDescription}
        ogImageValue={venue?.ogImage}
      />

      <SaveButton>Save venue</SaveButton>
    </form>
  );
}
