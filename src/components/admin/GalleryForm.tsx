import type { Gallery } from "@/generated/prisma/client";
import { Field, TextareaField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";

export function GalleryForm({
  action,
  gallery,
}: {
  action: (formData: FormData) => void;
  gallery?: Gallery;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <ImageManager name="image" label="Image" existing={gallery?.image ? [gallery.image] : []} />
      <Field label="Title" name="title" defaultValue={gallery?.title} required />
      <TextareaField label="Description" name="description" defaultValue={gallery?.description} rows={4} required />
      <SaveButton>Save gallery</SaveButton>
    </form>
  );
}
