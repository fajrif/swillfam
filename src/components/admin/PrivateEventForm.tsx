import type { PrivateEvent } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, CheckboxField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";

export function PrivateEventForm({
  action,
  privateEvent,
  eventTypes,
}: {
  action: (formData: FormData) => void;
  privateEvent?: PrivateEvent;
  eventTypes: { id: string; title: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-2 gap-6">
        <ImageManager name="image" label="Image" existing={privateEvent?.image ? [privateEvent.image] : []} />
        <ImageManager
          name="bannerImage"
          label="Banner image"
          existing={privateEvent?.bannerImage ? [privateEvent.bannerImage] : []}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" name="title" defaultValue={privateEvent?.title} required hint=" " />
        <SlugField sourceName="title" defaultValue={privateEvent?.slug} />
      </div>

      <SelectField
        label="Event type"
        name="privateEventTypeId"
        defaultValue={privateEvent?.privateEventTypeId ?? ""}
        blankLabel="— None —"
        options={eventTypes.map((t) => ({ value: t.id, label: t.title }))}
      />

      <Field label="Caption" name="caption" defaultValue={privateEvent?.caption} required />
      <TextareaField
        label="Short description"
        name="shortDescription"
        defaultValue={privateEvent?.shortDescription}
        rows={2}
        required
      />
      <TextareaField
        label="Description"
        name="description"
        defaultValue={privateEvent?.description}
        rows={4}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={privateEvent?.sortOrder ?? 0} />
        <CheckboxField label="Published" name="published" defaultChecked={privateEvent?.published ?? true} />
      </div>

      <SaveButton>Save private event</SaveButton>
    </form>
  );
}
