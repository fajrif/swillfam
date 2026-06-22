import type { Promotion } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, SaveButton, toDateInputValue } from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";
import { RichTextEditor } from "./RichTextEditor";

export function PromotionForm({
  action,
  promotion,
  venues,
}: {
  action: (formData: FormData) => void;
  promotion?: Promotion;
  venues: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-3 gap-6">
        <ImageManager name="image" label="Image" existing={promotion?.image ? [promotion.image] : []} />
        <ImageManager name="bannerImage" label="Banner image" existing={promotion?.bannerImage ? [promotion.bannerImage] : []} />
        <ImageManager name="posterImage" label="Poster image" existing={promotion?.posterImage ? [promotion.posterImage] : []} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={promotion?.name} required />
        <SlugField sourceName="name" defaultValue={promotion?.slug} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Venue"
          name="venueId"
          defaultValue={promotion?.venueId ?? ""}
          blankLabel="— None —"
          options={venues.map((v) => ({ value: v.id, label: v.name }))}
        />
        <Field label="Caption" name="caption" defaultValue={promotion?.caption} required />
      </div>

      <TextareaField label="Short description" name="shortDescription" defaultValue={promotion?.shortDescription} rows={2} required />
      <TextareaField label="Description" name="description" defaultValue={promotion?.description} rows={4} required />

      <RichTextEditor name="terms" label="Terms & conditions" defaultValue={promotion?.terms ?? ""} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date" name="startDate" type="date" defaultValue={toDateInputValue(promotion?.startDate)} required />
        <Field label="End date" name="endDate" type="date" defaultValue={toDateInputValue(promotion?.endDate)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start time" name="startHour" type="time" defaultValue={promotion?.startHour} required />
        <Field label="End time" name="endHour" type="time" defaultValue={promotion?.endHour} required />
      </div>

      <SaveButton>Save promotion</SaveButton>
    </form>
  );
}
