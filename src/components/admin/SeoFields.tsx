import { Field, TextareaField } from "./form-fields";

/** Meta title/description pair, reused on every resource form and the Page SEO screen. */
export function SeoFields({
  titleLabel = "Meta Title",
  titleName = "metaTitle",
  titleValue,
  descriptionLabel = "Meta Description",
  descriptionName = "metaDescription",
  descriptionValue,
}: {
  titleLabel?: string;
  titleName?: string;
  titleValue?: string | null;
  descriptionLabel?: string;
  descriptionName?: string;
  descriptionValue?: string | null;
}) {
  return (
    <div className="grid gap-4 rounded-md border bg-muted/40 p-4">
      <Field
        label={titleLabel}
        name={titleName}
        defaultValue={titleValue}
        hint="Optional. Falls back to the default page title if left blank."
      />
      <TextareaField
        label={descriptionLabel}
        name={descriptionName}
        defaultValue={descriptionValue}
        rows={2}
        hint="Optional. Falls back to the default page description if left blank."
      />
    </div>
  );
}
