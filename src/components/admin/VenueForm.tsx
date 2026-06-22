import type { Venue } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";

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
  categories,
}: {
  action: (formData: FormData) => void;
  venue?: Venue;
  categories: { id: string; name: string }[];
}) {
  // Preserve a previously-saved custom value that isn't one of the presets.
  const hoursOptions = [...OPERATING_HOURS_PRESETS];
  if (venue?.operatingHours && !hoursOptions.includes(venue.operatingHours)) {
    hoursOptions.unshift(venue.operatingHours);
  }

  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-2 gap-6">
        <ImageManager name="image" label="Image" existing={venue?.image ? [venue.image] : []} />
        <ImageManager name="bannerImage" label="Banner image" existing={venue?.bannerImage ? [venue.bannerImage] : []} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={venue?.name} required />
        <SlugField sourceName="name" defaultValue={venue?.slug} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Category"
          name="categoryId"
          defaultValue={venue?.categoryId ?? ""}
          blankLabel="— None —"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <SelectField
          label="Operating hours"
          name="operatingHours"
          defaultValue={venue?.operatingHours}
          options={hoursOptions.map((h) => ({ value: h, label: h }))}
        />
      </div>

      <TextareaField label="Description" name="description" defaultValue={venue?.description} rows={4} required />

      <Field label="Location / address" name="location" defaultValue={venue?.location} required />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitude" name="lat" type="number" step="any" defaultValue={venue?.lat ?? ""} hint="For Google Maps" />
        <Field label="Longitude" name="lng" type="number" step="any" defaultValue={venue?.lng ?? ""} />
      </div>

      <TextareaField label="Spotify embed" name="spotifyEmbed" defaultValue={venue?.spotifyEmbed ?? ""} rows={2} />
      <TextareaField label="YouTube embed" name="youtubeEmbed" defaultValue={venue?.youtubeEmbed ?? ""} rows={2} />
      <TextareaField label="Instagram embed" name="instagramEmbed" defaultValue={venue?.instagramEmbed ?? ""} rows={2} />

      <SaveButton>Save venue</SaveButton>
    </form>
  );
}
