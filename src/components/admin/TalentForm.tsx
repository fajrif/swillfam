import type { Talent } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";

export function TalentForm({
  action,
  talent,
  venues,
  categories,
}: {
  action: (formData: FormData) => void;
  talent?: Talent;
  venues: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <ImageManager name="image" label="Image" existing={talent?.image ? [talent.image] : []} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={talent?.name} required />
        <SlugField sourceName="name" defaultValue={talent?.slug} />
      </div>
      <Field label="Speciality / role" name="speciality" defaultValue={talent?.speciality} required />
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Venue"
          name="venueId"
          defaultValue={talent?.venueId ?? ""}
          blankLabel="— None —"
          options={venues.map((v) => ({ value: v.id, label: v.name }))}
        />
        <SelectField
          label="Category"
          name="talentCategoryId"
          defaultValue={talent?.talentCategoryId ?? ""}
          blankLabel="— None —"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>
      <Field label="Instagram URL" name="instagramUrl" type="url" defaultValue={talent?.instagramUrl ?? ""} />
      <TextareaField label="Description" name="description" defaultValue={talent?.description} rows={4} required />

      <TextareaField label="Spotify embed" name="spotifyEmbed" defaultValue={talent?.spotifyEmbed ?? ""} rows={2} hint="Paste the full <iframe> embed code. Shown in the talent's Signature Sound section." />
      <TextareaField label="YouTube embed" name="youtubeEmbed" defaultValue={talent?.youtubeEmbed ?? ""} rows={2} />
      <TextareaField label="Instagram embed" name="instagramEmbed" defaultValue={talent?.instagramEmbed ?? ""} rows={2} />

      <SaveButton>Save talent</SaveButton>
    </form>
  );
}
