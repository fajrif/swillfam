import type { PrivateEventTestimonial } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, CheckboxField, SaveButton } from "./form-fields";

export function PrivateEventTestimonialForm({
  action,
  testimonial,
  privateEvents,
}: {
  action: (formData: FormData) => void;
  testimonial?: PrivateEventTestimonial;
  privateEvents: { id: string; title: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <TextareaField
        label="Quote"
        name="quote"
        defaultValue={testimonial?.quote}
        rows={4}
        required
        hint="Written without quotation marks — the page adds them."
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Author" name="author" defaultValue={testimonial?.author} required />
        <SelectField
          label="Private event"
          name="privateEventId"
          defaultValue={testimonial?.privateEventId ?? ""}
          blankLabel="— None —"
          options={privateEvents.map((p) => ({ value: p.id, label: p.title }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={testimonial?.sortOrder ?? 0} />
        <CheckboxField label="Published" name="published" defaultChecked={testimonial?.published ?? true} />
      </div>

      <SaveButton>Save testimonial</SaveButton>
    </form>
  );
}
