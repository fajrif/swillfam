import type { Event } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, CheckboxField, SaveButton, toDateInputValue } from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";
import { EventScheduleFields } from "./EventScheduleFields";

export function EventForm({
  action,
  event,
  venues,
  categories,
}: {
  action: (formData: FormData) => void;
  event?: Event;
  venues: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-3 gap-6">
        <ImageManager name="image" label="Image" existing={event?.image ? [event.image] : []} />
        <ImageManager name="bannerImage" label="Banner image" existing={event?.bannerImage ? [event.bannerImage] : []} />
        <ImageManager name="posterImage" label="Poster image" existing={event?.posterImage ? [event.posterImage] : []} />
      </div>

      <ImageManager
        name="galleries"
        label="Gallery images"
        multiple
        existing={event?.galleries ?? []}
        hint="Add multiple images; reorder with ↑ ↓, select + delete to remove."
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={event?.name} required />
        <SlugField sourceName="name" defaultValue={event?.slug} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Category"
          name="eventCategoryId"
          defaultValue={event?.eventCategoryId ?? ""}
          blankLabel="— None —"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <SelectField
          label="Venue"
          name="venueId"
          defaultValue={event?.venueId ?? ""}
          blankLabel="— None —"
          options={venues.map((v) => ({ value: v.id, label: v.name }))}
        />
      </div>

      <Field label="Caption" name="caption" defaultValue={event?.caption} required />
      <TextareaField label="Short description" name="shortDescription" defaultValue={event?.shortDescription} rows={2} required />
      <TextareaField label="Description" name="description" defaultValue={event?.description} rows={4} required />

      <EventScheduleFields
        defaultEventType={event?.eventType}
        defaultStartDate={toDateInputValue(event?.startDate)}
        defaultEndDate={toDateInputValue(event?.endDate)}
        defaultStartHour={event?.startHour}
        defaultEndHour={event?.endHour}
        defaultRecurringDays={event?.recurringDays ?? []}
      />

      <div className="flex gap-8">
        <CheckboxField label="Featured" name="featured" defaultChecked={event?.featured} />
        <CheckboxField label="Private event" name="isPrivate" defaultChecked={event?.isPrivate} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ticket info" name="ticketInfo" defaultValue={event?.ticketInfo ?? ""} />
        <Field label="Ticket link" name="ticketLink" type="url" defaultValue={event?.ticketLink ?? ""} />
      </div>
      <Field label="WhatsApp phone" name="waPhone" defaultValue={event?.waPhone ?? ""} placeholder="+62…" />

      <SaveButton>Save event</SaveButton>
    </form>
  );
}
