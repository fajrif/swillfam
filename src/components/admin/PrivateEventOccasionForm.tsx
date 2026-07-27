import type { PrivateEventOccasion } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, CheckboxField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";

export function PrivateEventOccasionForm({
  action,
  occasion,
  privateEvents,
}: {
  action: (formData: FormData) => void;
  occasion?: PrivateEventOccasion;
  privateEvents: { id: string; title: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <ImageManager name="image" label="Image" existing={occasion?.image ? [occasion.image] : []} />

      <Field label="Title" name="title" defaultValue={occasion?.title} required />

      <SelectField
        label="Private event"
        name="privateEventId"
        defaultValue={occasion?.privateEventId ?? ""}
        blankLabel="— None —"
        options={privateEvents.map((p) => ({ value: p.id, label: p.title }))}
        required
      />

      <TextareaField
        label="Description"
        name="description"
        defaultValue={occasion?.description}
        rows={3}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={occasion?.sortOrder ?? 0} />
        <CheckboxField label="Published" name="published" defaultChecked={occasion?.published ?? true} />
      </div>

      <SaveButton>Save occasion</SaveButton>
    </form>
  );
}
