import type { Video } from "@/generated/prisma/client";
import { Field, TextareaField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";

export function VideoForm({
  action,
  video,
}: {
  action: (formData: FormData) => void;
  video?: Video;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <ImageManager name="image" label="Thumbnail image" existing={video?.image ? [video.image] : []} />
      <Field label="Title" name="title" defaultValue={video?.title} required />
      <Field
        label="YouTube URL"
        name="videoUrl"
        type="url"
        defaultValue={video?.videoUrl}
        placeholder="https://www.youtube.com/watch?v=…"
        required
      />
      <TextareaField label="Description" name="description" defaultValue={video?.description} rows={4} required />
      <SaveButton>Save video</SaveButton>
    </form>
  );
}
