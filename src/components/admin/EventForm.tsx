import type { Event } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, CheckboxField, CheckboxGroupField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";
import { RichTextEditor } from "./RichTextEditor";
import { SlugField } from "./SlugField";
import { EventScheduleFields } from "./EventScheduleFields";
import { SeoFields } from "./SeoFields";
import { toDateInputValue } from "@/lib/date";

export function EventForm({
  action,
  event,
  venues,
  categories,
  talents,
  selectedTalentIds = [],
}: {
  action: (formData: FormData) => void;
  event?: Event;
  venues: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  talents: { id: string; name: string }[];
  selectedTalentIds?: string[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-3 gap-6">
        <ImageManager name="image" label="Image" existing={event?.image ? [event.image] : []} hint="Shown on the event card in listings." />
        <ImageManager name="bannerImage" label="Banner image" existing={event?.bannerImage ? [event.bannerImage] : []} hint="Shown as the banner on the event page." />
        <ImageManager name="posterImage" label="Poster image" existing={event?.posterImage ? [event.posterImage] : []} hint="Optional. Shown as the poster on the event page." />
      </div>

      <ImageManager
        name="galleries"
        label="Gallery images"
        multiple
        existing={event?.galleries ?? []}
        hint="Add multiple images; reorder with ↑ ↓, select + delete to remove."
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={event?.name} required hint=" " />
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

      <CheckboxGroupField
        label="Talents"
        name="talentIds"
        options={talents.map((t) => ({ value: t.id, label: t.name }))}
        defaultValues={selectedTalentIds}
        hint="Talents performing at this event."
      />

      <Field label="Caption" name="caption" defaultValue={event?.caption} required />
      <TextareaField
        label="Short description"
        name="shortDescription"
        defaultValue={event?.shortDescription}
        rows={2}
        required
        hint="Shown on the event card in listings, and as a fallback for the page's meta description. For recurring events, this is also the fallback for the 'Next Edition Event' paragraph when the Next edition description field below is left blank."
      />
      <RichTextEditor name="description" label="Description" defaultValue={event?.description ?? ""} />

      <EventScheduleFields
        defaultEventType={event?.eventType}
        defaultStartDate={toDateInputValue(event?.startDate)}
        defaultEndDate={toDateInputValue(event?.endDate)}
        defaultStartHour={event?.startHour}
        defaultEndHour={event?.endHour}
        defaultRecurringDays={event?.recurringDays ?? []}
        defaultNextEditionDescription={event?.nextEditionDescription ?? ""}
      />

      <div className="flex gap-8">
        <CheckboxField label="Featured" name="featured" defaultChecked={event?.featured} />
        {/* Uncheck to retire: hidden from the public calendar and listings, but
            the detail page still renders as a "Past Event". New events default on. */}
        <CheckboxField label="Active" name="active" defaultChecked={event?.active ?? true} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ticket info" name="ticketInfo" defaultValue={event?.ticketInfo ?? ""} />
        <Field label="Ticket link" name="ticketLink" type="url" defaultValue={event?.ticketLink ?? ""} />
      </div>
      <Field label="WhatsApp phone" name="waPhone" defaultValue={event?.waPhone ?? ""} placeholder="+62…" />

      <SeoFields titleValue={event?.metaTitle} descriptionValue={event?.metaDescription} />

      <SaveButton>Save event</SaveButton>
    </form>
  );
}
