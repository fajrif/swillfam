import type { MediaMention } from "@/generated/prisma/client";
import { Field, TextareaField, SaveButton } from "./form-fields";
import { toDateInputValue } from "@/lib/date";

export function MediaMentionForm({
  action,
  mediaMention,
}: {
  action: (formData: FormData) => void;
  mediaMention?: MediaMention;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <Field label="Title" name="title" defaultValue={mediaMention?.title} required />
      <Field label="Article title" name="articleTitle" defaultValue={mediaMention?.articleTitle} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Publication name" name="publicationName" defaultValue={mediaMention?.publicationName} required />
        <Field label="Published date" name="publishedDate" type="date" defaultValue={toDateInputValue(mediaMention?.publishedDate)} required />
      </div>
      <TextareaField label="Short description" name="shortDescription" defaultValue={mediaMention?.shortDescription} rows={4} required />
      <Field label="Link" name="link" type="url" defaultValue={mediaMention?.link} required />
      <SaveButton>Save media mention</SaveButton>
    </form>
  );
}
