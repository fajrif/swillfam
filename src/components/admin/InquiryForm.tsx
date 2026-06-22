import type { Inquiry } from "@/generated/prisma/client";
import { SelectField, SaveButton } from "./form-fields";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CLOSED", label: "Closed" },
];

export function InquiryForm({
  inquiry,
  action,
}: {
  inquiry: Inquiry;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <Info label="Name" value={inquiry.fullName} />
        <Info label="Email" value={inquiry.email} />
      </div>

      <Info label="Subject" value={inquiry.subject} />

      <div>
        <div className="text-sm text-zinc-500 mb-1">Message</div>
        <p className="text-sm text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-md p-3 whitespace-pre-wrap">
          {inquiry.description}
        </p>
      </div>

      <SelectField label="Status" name="status" defaultValue={inquiry.status} options={STATUS_OPTIONS} />

      <SaveButton>Save status</SaveButton>
    </form>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-zinc-500">{label}</div>
      <div className="font-medium text-zinc-900 break-words">{value}</div>
    </div>
  );
}
