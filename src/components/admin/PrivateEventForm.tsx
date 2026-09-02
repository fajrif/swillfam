import type { PrivateEvent } from "@/generated/prisma/client";
import {
  Field,
  TextareaField,
  SelectField,
  CheckboxField,
  CheckboxGroupField,
  SaveButton,
} from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";

export function PrivateEventForm({
  action,
  privateEvent,
  eventTypes,
  venues,
  selectedVenueIds = [],
}: {
  action: (formData: FormData) => void;
  privateEvent?: PrivateEvent;
  eventTypes: { id: string; title: string }[];
  venues: { id: string; name: string }[];
  selectedVenueIds?: string[];
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
        <Field label="Title" name="title" defaultValue={privateEvent?.title} required hint="Short label used on the archive page's card." />
        <SlugField sourceName="title" defaultValue={privateEvent?.slug} />
      </div>
      <Field
        label="Hero title"
        name="heroTitle"
        defaultValue={privateEvent?.heroTitle ?? ""}
        hint="Detail-page banner headline, e.g. “Corporate Events at SwillFam”. Falls back to Title if left blank."
      />

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
        rows={6}
        required
        hint="Blank lines become separate paragraphs on the detail page."
      />

      <CheckboxGroupField
        label="Recommended venues"
        name="venueIds"
        options={venues.map((v) => ({ value: v.id, label: v.name }))}
        defaultValues={selectedVenueIds}
        hint="Shown in the “Recommended Venues for …” grid, ordered by venue name."
      />

      <ImageManager
        name="galleries"
        label="Gallery images"
        multiple
        existing={privateEvent?.galleries ?? []}
      />

      <fieldset className="space-y-4 rounded-md border p-4">
        <legend className="px-1 text-sm font-medium">Section headings</legend>
        <p className="text-xs text-muted-foreground">
          Optional — each falls back to a sensible default when left blank.
        </p>
        <Field
          label="Occasions title"
          name="occasionsTitle"
          defaultValue={privateEvent?.occasionsTitle ?? ""}
          placeholder="Suitable for Different Corporate Occasions:"
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Testimonials title"
            name="testimonialsTitle"
            defaultValue={privateEvent?.testimonialsTitle ?? ""}
            placeholder="Trusted for Private Moments"
          />
          <Field
            label="Testimonials lead"
            name="testimonialsLead"
            defaultValue={privateEvent?.testimonialsLead ?? ""}
          />
        </div>
        <Field
          label="Venues title"
          name="venuesTitle"
          defaultValue={privateEvent?.venuesTitle ?? ""}
          placeholder="Recommended Venues for Corporate Events"
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Gallery title"
            name="galleryTitle"
            defaultValue={privateEvent?.galleryTitle ?? ""}
            placeholder="Corporate Events We Can Host"
          />
          <Field
            label="Gallery lead"
            name="galleryLead"
            defaultValue={privateEvent?.galleryLead ?? ""}
          />
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={privateEvent?.sortOrder ?? 0} />
        <CheckboxField label="Published" name="published" defaultChecked={privateEvent?.published ?? true} />
      </div>

      <SaveButton>Save private event</SaveButton>
    </form>
  );
}
