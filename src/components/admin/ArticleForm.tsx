import type { Article } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, SaveButton, toDateInputValue } from "./form-fields";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";
import { RichTextEditor } from "./RichTextEditor";

export function ArticleForm({
  action,
  article,
  categories,
}: {
  action: (formData: FormData) => void;
  article?: Article;
  categories: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <ImageManager name="image" label="Cover image" existing={article?.image ? [article.image] : []} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" name="title" defaultValue={article?.title} required />
        <SlugField sourceName="title" defaultValue={article?.slug} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Category"
          name="articleCategoryId"
          defaultValue={article?.articleCategoryId ?? ""}
          blankLabel="— None —"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <SelectField
          label="Status"
          name="status"
          defaultValue={String(article?.status ?? 0)}
          options={[
            { value: "0", label: "Draft" },
            { value: "1", label: "Published" },
          ]}
        />
      </div>

      <Field
        label="Published date"
        name="publishedDate"
        type="date"
        defaultValue={toDateInputValue(article?.publishedDate)}
        required
      />

      <TextareaField
        label="Short description"
        name="shortDescription"
        defaultValue={article?.shortDescription}
        rows={2}
        required
      />

      <RichTextEditor name="description" label="Content" defaultValue={article?.description ?? ""} />

      <SaveButton>Save article</SaveButton>
    </form>
  );
}
