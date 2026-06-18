import type { Inquiry } from "@/generated/prisma/client";

type InquiryFormProps = {
  inquiry: Inquiry;
  action: (formData: FormData) => void;
};

export function InquiryForm({ inquiry, action }: InquiryFormProps) {
  return (
    <form action={action} className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-zinc-500">Business</div>
          <div className="font-medium text-zinc-900">{inquiry.businessName}</div>
        </div>
        <div>
          <div className="text-zinc-500">Contact</div>
          <div className="font-medium text-zinc-900">{inquiry.contactName}</div>
        </div>
        <div>
          <div className="text-zinc-500">Email</div>
          <div className="font-medium text-zinc-900">{inquiry.email}</div>
        </div>
        <div>
          <div className="text-zinc-500">Phone</div>
          <div className="font-medium text-zinc-900">{inquiry.phone ?? "—"}</div>
        </div>
      </div>

      {inquiry.message && (
        <div>
          <div className="text-sm text-zinc-500 mb-1">Message</div>
          <p className="text-sm text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-md p-3">
            {inquiry.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-zinc-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={inquiry.status}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="packageInterest" className="block text-sm font-medium text-zinc-700 mb-1">
            Preferred package
          </label>
          <select
            id="packageInterest"
            name="packageInterest"
            defaultValue={inquiry.packageInterest ?? ""}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">—</option>
            <option value="BASIC">Basic</option>
            <option value="PLUS">Plus</option>
            <option value="BUSINESS">Business</option>
          </select>
        </div>

        <div>
          <label htmlFor="expectedUsers" className="block text-sm font-medium text-zinc-700 mb-1">
            Expected users
          </label>
          <input
            id="expectedUsers"
            name="expectedUsers"
            type="number"
            min={0}
            defaultValue={inquiry.expectedUsers ?? ""}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-md bg-zinc-900 text-white text-sm font-medium px-4 py-2 hover:bg-zinc-800 transition-colors"
      >
        Save changes
      </button>
    </form>
  );
}
