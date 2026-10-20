import type { Event, TalentStatus } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, CheckboxField, ReadOnlyField, SaveButton } from "./form-fields";
import { MultiSelectField } from "./MultiSelectField";
import { ImageManager } from "./ImageManager";
import { RichTextEditor } from "./RichTextEditor";
import { SlugField } from "./SlugField";
import { EventScheduleFields } from "./EventScheduleFields";
import { SeoFields } from "./SeoFields";
import { toDateInputValue } from "@/lib/date";
import { EVENT_SCHEMA_TYPES, EVENT_STATUSES } from "@/lib/schema-options";

const talentStatusLabel = (status: TalentStatus) => (status === "RESIDENT" ? "Resident" : "Guest");

export function EventForm({
  action,
  event,
  venues,
  categories,
  talents,
  selectedTalentIds = [],
  operatorVenue,
  altsByPath,
}: {
  action: (formData: FormData) => void;
  event?: Event;
  venues: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  talents: { id: string; name: string; status: TalentStatus }[];
  selectedTalentIds?: string[];
  /** Set for operators: the venue is fixed to theirs and Featured is hidden. */
  operatorVenue?: { id: string; name: string };
  /** Stored alt text by image path, from `getImageAltRecord()`. */
  altsByPath?: Record<string, string>;
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-3 gap-6">
        <ImageManager altsByPath={altsByPath} name="image" label="Image" existing={event?.image ? [event.image] : []} hint="Shown on the event card in listings." />
        <ImageManager altsByPath={altsByPath} name="bannerImage" label="Banner image" existing={event?.bannerImage ? [event.bannerImage] : []} hint="Shown as the banner on the event page." />
        <ImageManager altsByPath={altsByPath} name="posterImage" label="Poster image" existing={event?.posterImage ? [event.posterImage] : []} hint="Optional. Shown as the poster on the event page." />
      </div>

      <ImageManager
        altsByPath={altsByPath}
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
        {operatorVenue ? (
          <ReadOnlyField label="Venue" value={operatorVenue.name} />
        ) : (
          <SelectField
            label="Venue"
            name="venueId"
            defaultValue={event?.venueId ?? ""}
            blankLabel="— None —"
            options={venues.map((v) => ({ value: v.id, label: v.name }))}
          />
        )}
      </div>

      <MultiSelectField
        label="Talents"
        name="talentIds"
        options={talents.map((t) => ({ value: t.id, label: `${t.name} (${talentStatusLabel(t.status)})` }))}
        defaultValues={selectedTalentIds}
        placeholder="Search talents…"
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
        {/* Featured drives site-wide slots (home, the /events hero) — administrators only. */}
        {!operatorVenue && <CheckboxField label="Featured" name="featured" defaultChecked={event?.featured} />}
        {/* Uncheck to retire: hidden from the public calendar and listings, but
            the detail page still renders as a "Past Event". New events default on. */}
        <CheckboxField label="Active" name="active" defaultChecked={event?.active ?? true} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Event type"
          name="schemaEventType"
          defaultValue={event?.schemaEventType ?? "Event"}
          options={EVENT_SCHEMA_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          hint="How search engines classify this event."
        />
        <SelectField
          label="Status"
          name="eventStatus"
          defaultValue={event?.eventStatus ?? "EventScheduled"}
          options={EVENT_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
          hint="Cancelling or postponing keeps the page and its dates — only this changes. Don't delete the event."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ticket info" name="ticketInfo" defaultValue={event?.ticketInfo ?? ""} />
        <Field label="Ticket link" name="ticketLink" type="url" defaultValue={event?.ticketLink ?? ""} />
      </div>
      <Field label="WhatsApp phone" name="waPhone" defaultValue={event?.waPhone ?? ""} placeholder="+62…" />

      {/* A past event's CTA points at the recap instead of reservations. */}
      <div className="space-y-4 rounded-md border bg-muted/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Recap video
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Recap video URL"
            name="recapVideoUrl"
            type="url"
            defaultValue={event?.recapVideoUrl ?? ""}
            placeholder="https://www.youtube.com/watch?v=…"
            hint="Shown as the call to action once the event has passed."
          />
          <Field
            label="Duration"
            name="recapDuration"
            defaultValue={event?.recapDuration ?? ""}
            placeholder="2:15"
            hint="Length of the video — type it as 2:15 or 1:02:30."
          />
        </div>
        <ImageManager
        altsByPath={altsByPath}
          name="recapThumbnail"
          label="Recap thumbnail"
          existing={event?.recapThumbnail ? [event.recapThumbnail] : []}
          hint="Still frame for the recap video."
          // No alt input: this is a poster behind a play button, and the
          // button already carries the accessible name.
          alts={false}
        />
      </div>

      <SeoFields
        titleValue={event?.metaTitle}
        descriptionValue={event?.metaDescription}
        ogImageValue={event?.ogImage}
      />

      <SaveButton>Save event</SaveButton>
    </form>
  );
}
