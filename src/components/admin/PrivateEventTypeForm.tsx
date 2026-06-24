import type { PrivateEventType } from "@/generated/prisma/client";
import { Field, TextareaField, CheckboxField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";

export function PrivateEventTypeForm({
  action,
  eventType,
}: {
  action: (formData: FormData) => void;
  eventType?: PrivateEventType;
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <ImageManager name="image" label="Image" existing={eventType?.image ? [eventType.image] : []} />

      <Field label="Title" name="title" defaultValue={eventType?.title} required />
      <TextareaField
        label="Description"
        name="description"
        defaultValue={eventType?.description}
        rows={4}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={eventType?.sortOrder ?? 0} />
        <CheckboxField label="Published" name="published" defaultChecked={eventType?.published ?? true} />
      </div>

      <SaveButton>Save event type</SaveButton>
    </form>
  );
}
