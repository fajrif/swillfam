import type { Category } from "@/generated/prisma/client";
import { Field, TextareaField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";

export function CategoryForm({
  action,
  category,
}: {
  action: (formData: FormData) => void;
  category?: Category;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <ImageManager name="image" label="Image" existing={category?.image ? [category.image] : []} />
        <ImageManager name="bannerImage" label="Banner image" existing={category?.bannerImage ? [category.bannerImage] : []} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={category?.name} required hint=" " />
        <SlugField sourceName="name" defaultValue={category?.slug} />
      </div>
      <TextareaField label="Caption" name="caption" defaultValue={category?.caption} rows={3} required />
      <Field label="Headline" name="headline" defaultValue={category?.headline ?? ""} hint="Hero banner title, e.g. “Dining, Cocktails, and Everything In Between”." />
      <Field label="Intro title" name="introTitle" defaultValue={category?.introTitle ?? ""} hint="Title shown in the intro section below the hero, e.g. “Where Jakarta Comes to Gather”. Falls back to Headline if left blank." />
      <TextareaField label="Description" name="description" defaultValue={category?.description ?? ""} rows={6} hint="Long intro paragraph shown on the public category page." />
      <TextareaField label="Short description" name="shortDescription" defaultValue={category?.shortDescription ?? ""} rows={5} hint="Shown in the sibling-category section on the other category's page (e.g. promotes this category). Supports multiple paragraphs." />
      <SaveButton>Save category</SaveButton>
    </form>
  );
}
