import type { Promotion } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";
import { RichTextEditor } from "./RichTextEditor";
import { SeoFields } from "./SeoFields";
import { toDateInputValue } from "@/lib/date";

export function PromotionForm({
  action,
  promotion,
  venues,
  categories,
}: {
  action: (formData: FormData) => void;
  promotion?: Promotion;
  venues: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-3 gap-6">
        <ImageManager name="image" label="Image" existing={promotion?.image ? [promotion.image] : []} hint="Shown on the promotion card in listings." />
        <ImageManager name="bannerImage" label="Banner image" existing={promotion?.bannerImage ? [promotion.bannerImage] : []} hint="Shown as the banner on the promotion page." />
        <ImageManager name="posterImage" label="Poster image" existing={promotion?.posterImage ? [promotion.posterImage] : []} hint="Optional. Shown as the poster on the promotion page." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={promotion?.name} required hint=" " />
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
        <SelectField
          label="Category"
          name="promotionCategoryId"
          defaultValue={promotion?.promotionCategoryId ?? ""}
          blankLabel="— None —"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      <Field label="Caption" name="caption" defaultValue={promotion?.caption} required />

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

      <SeoFields titleValue={promotion?.metaTitle} descriptionValue={promotion?.metaDescription} />

      <SaveButton>Save promotion</SaveButton>
    </form>
  );
}
