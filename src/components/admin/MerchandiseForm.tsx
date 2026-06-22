import type { Merchandise } from "@/generated/prisma/client";
import { Field, TextareaField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";

export function MerchandiseForm({
  action,
  merchandise,
}: {
  action: (formData: FormData) => void;
  merchandise?: Merchandise;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <ImageManager
        name="image"
        label="Image"
        existing={merchandise?.image ? [merchandise.image] : []}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={merchandise?.name} required />
        <Field
          label="Price"
          name="price"
          type="number"
          min={0}
          step="0.01"
          defaultValue={merchandise?.price.toString()}
          required
        />
      </div>
      <TextareaField
        label="Short description"
        name="shortDescription"
        defaultValue={merchandise?.shortDescription}
        rows={3}
        required
      />
      <SaveButton>Save merchandise</SaveButton>
    </form>
  );
}
