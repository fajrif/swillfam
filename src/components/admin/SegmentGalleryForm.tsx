import type { SegmentGallery } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, CheckboxField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";

export function SegmentGalleryForm({
  action,
  segmentGallery,
  venues,
}: {
  action: (formData: FormData) => void;
  segmentGallery?: SegmentGallery;
  venues: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <ImageManager
        name="images"
        label="Images"
        multiple
        captions
        existing={segmentGallery?.images ?? []}
        existingTitles={segmentGallery?.imageTitles ?? []}
        existingDescriptions={segmentGallery?.imageDescriptions ?? []}
        hint="Add multiple images; reorder with ↑ ↓, select + delete to remove. The per-image Title/Description are shown only on 'Special' galleries (the dishes template)."
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" name="title" defaultValue={segmentGallery?.title} required />
        <SelectField
          label="Venue"
          name="venueId"
          defaultValue={segmentGallery?.venueId ?? ""}
          blankLabel="— None —"
          options={venues.map((v) => ({ value: v.id, label: v.name }))}
        />
      </div>
      <TextareaField label="Description" name="description" defaultValue={segmentGallery?.description} rows={4} required />
      <CheckboxField
        label="Special (rendered differently on the public site)"
        name="special"
        defaultChecked={segmentGallery?.special}
      />
      <SaveButton>Save segment gallery</SaveButton>
    </form>
  );
}
