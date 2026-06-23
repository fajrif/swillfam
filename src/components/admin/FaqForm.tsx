"use client";

import type { Faq } from "@/generated/prisma/client";
import { Field, TextareaField, CheckboxField, SaveButton } from "./form-fields";
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
        <Field label="Segment" name="segment" defaultValue={faq?.segment ?? "general"} placeholder="e.g. private_events" />
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
