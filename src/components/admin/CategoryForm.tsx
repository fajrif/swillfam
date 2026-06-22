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
      <ImageManager name="image" label="Image" existing={category?.image ? [category.image] : []} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={category?.name} required />
        <SlugField sourceName="name" defaultValue={category?.slug} />
      </div>
      <TextareaField label="Caption" name="caption" defaultValue={category?.caption} rows={3} required />
      <SaveButton>Save category</SaveButton>
    </form>
  );
}
