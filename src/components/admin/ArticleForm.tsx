import type { Article } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, SaveButton } from "./form-fields";
import { MultiSelectField } from "./MultiSelectField";
import { ImageManager } from "./ImageManager";
import { SlugField } from "./SlugField";
import { RichTextEditor } from "./RichTextEditor";
import { SeoFields } from "./SeoFields";
import { toDateInputValue } from "@/lib/date";

export function ArticleForm({
  action,
  article,
  categories,
  venues,
  selectedVenueIds = [],
  altsByPath,
}: {
  action: (formData: FormData) => void;
  article?: Article;
  categories: { id: string; name: string }[];
  venues: { id: string; name: string }[];
  selectedVenueIds?: string[];
  /** Stored alt text by image path, from `getImageAltRecord()`. */
  altsByPath?: Record<string, string>;
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <ImageManager altsByPath={altsByPath} name="image" label="Cover image" existing={article?.image ? [article.image] : []} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" name="title" defaultValue={article?.title} required hint=" " />
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

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Published date"
          name="publishedDate"
          type="date"
          defaultValue={toDateInputValue(article?.publishedDate)}
          required
          hint=" "
        />
        <Field
          label="Author"
          name="author"
          defaultValue={article?.author ?? ""}
          placeholder="SwillFam Editorial"
          hint="Credited as the article's author to search engines. Shown as the brand if left blank."
        />
      </div>

      <MultiSelectField
        label="Venues mentioned"
        name="venueIds"
        options={venues.map((v) => ({ value: v.id, label: v.name }))}
        defaultValues={selectedVenueIds}
        placeholder="Search venues…"
        hint="Tells search engines which venues this guide is about, linking it to their pages."
      />

      <TextareaField
        label="Short description"
        name="shortDescription"
        defaultValue={article?.shortDescription}
        rows={2}
        required
      />

      <RichTextEditor name="description" label="Content" defaultValue={article?.description ?? ""} />

      <SeoFields
        titleValue={article?.metaTitle}
        descriptionValue={article?.metaDescription}
        ogImageValue={article?.ogImage}
      />

      <SaveButton>Save article</SaveButton>
    </form>
  );
}
