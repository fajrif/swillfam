import type { Career } from "@/generated/prisma/client";
import { Field, TextareaField, SelectField, SaveButton } from "./form-fields";

export const EMPLOYMENT_OPTIONS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
];

export function CareerForm({
  action,
  career,
}: {
  action: (formData: FormData) => void;
  career?: Career;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Job title" name="jobTitle" defaultValue={career?.jobTitle} required />
        <Field label="Department or venue" name="department" defaultValue={career?.department} required />
        <SelectField
          label="Employment type"
          name="employmentType"
          defaultValue={career?.employmentType}
          options={EMPLOYMENT_OPTIONS}
        />
        <Field label="Location" name="location" defaultValue={career?.location} required />
      </div>
      <TextareaField label="Description" name="description" defaultValue={career?.description} rows={6} required />
      <SaveButton>Save career</SaveButton>
    </form>
  );
}
