import type { Talent } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";

export function TalentForm({
  action,
  talent,
  venues,
}: {
  action: (formData: FormData) => void;
  talent?: Talent;
  venues: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <ImageManager name="image" label="Image" existing={talent?.image ? [talent.image] : []} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={talent?.name} required />
        <Field label="Speciality" name="speciality" defaultValue={talent?.speciality} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Venue"
          name="venueId"
          defaultValue={talent?.venueId ?? ""}
          blankLabel="— None —"
          options={venues.map((v) => ({ value: v.id, label: v.name }))}
        />
        <Field label="Instagram URL" name="instagramUrl" type="url" defaultValue={talent?.instagramUrl ?? ""} />
      </div>
      <TextareaField label="Description" name="description" defaultValue={talent?.description} rows={4} required />
      <SaveButton>Save talent</SaveButton>
    </form>
  );
}
