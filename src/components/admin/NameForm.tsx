import { Field, SaveButton } from "./form-fields";

/** Minimal form for name-only resources (ArticleCategory, EventCategory). */
export function NameForm({
  action,
  name,
  label = "Name",
}: {
  action: (formData: FormData) => void;
  name?: string;
  label?: string;
}) {
  return (
    <form action={action} className="space-y-6 max-w-lg">
      <Field label={label} name="name" defaultValue={name} required />
      <SaveButton>Save</SaveButton>
    </form>
  );
}
