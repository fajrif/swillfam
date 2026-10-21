import { ImageManager } from "./ImageManager";
import { SaveButton } from "./form-fields";

export function PrivateEventMomentsForm({
  action,
  images,
  altsByPath,
}: {
  action: (formData: FormData) => void;
  images: string[];
  /** Stored alt text by image path, from `getImageAltRecord()`. */
  altsByPath?: Record<string, string>;
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <ImageManager
        altsByPath={altsByPath}
        name="images"
        label="Images"
        multiple
        existing={images}
        hint="Add several at once; reorder with ↑ ↓, tick + “Delete selected” to remove. The first image is the first slide. Describe each picture in Alt text — it is what screen readers and search engines read."
      />
      <SaveButton>Save gallery</SaveButton>
    </form>
  );
}
