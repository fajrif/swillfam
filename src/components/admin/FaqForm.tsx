"use client";

import type { Faq } from "@/generated/prisma/client";
import { FAQ_SEGMENTS } from "@/lib/faq-segments";
import { Field, CheckboxField, SaveButton } from "./form-fields";
import { SelectField } from "./SelectField";
import { RichTextEditor } from "./RichTextEditor";

export function FaqForm({
  action,
  faq,
}: {
  action: (formData: FormData) => void;
  faq?: Faq;
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Question" name="question" defaultValue={faq?.question} required />
        <SelectField
          label="Segment"
          name="segment"
          defaultValue={faq?.segment ?? "general"}
          options={FAQ_SEGMENTS.map((s) => ({ value: s.value, label: s.label }))}
        />
        <Field
          label="Ref slug"
          name="refSlug"
          defaultValue={faq?.refSlug ?? ""}
          placeholder="e.g. kilo, corporate-events"
          hint="Only for the singular segments — leave blank for the archive-wide ones."
        />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={faq?.sortOrder ?? 0} />
        <div className="flex items-end pb-1.5">
          <CheckboxField label="Published" name="published" defaultChecked={faq?.published ?? true} />
        </div>
      </div>
      <RichTextEditor name="answer" label="Answer" defaultValue={faq?.answer} />
      <SaveButton>Save FAQ</SaveButton>
    </form>
  );
}
