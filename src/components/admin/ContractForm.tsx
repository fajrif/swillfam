import type { ClientContract } from "@/generated/prisma/client";

type ContractFormProps = {
  contract?: ClientContract;
  action: (formData: FormData) => void;
};

function toDateInputValue(date: Date | undefined) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function ContractForm({ contract, action }: ContractFormProps) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Business name" name="businessName" defaultValue={contract?.businessName} required />
        <Field label="Contact person" name="contactName" defaultValue={contract?.contactName} required />
        <Field label="Contact email" name="contactEmail" type="email" defaultValue={contract?.contactEmail} required />
        <Field label="Contact phone" name="contactPhone" defaultValue={contract?.contactPhone ?? ""} />
        <Field label="Server domain" name="serverDomain" defaultValue={contract?.serverDomain} required />
        <Field label="Server address / hosting notes" name="serverAddress" defaultValue={contract?.serverAddress ?? ""} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="package" className="block text-sm font-medium text-zinc-700 mb-1">
            Package
          </label>
          <select
            id="package"
            name="package"
            defaultValue={contract?.package ?? "BASIC"}
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="BASIC">Basic</option>
            <option value="PLUS">Plus</option>
            <option value="BUSINESS">Business</option>
          </select>
        </div>

        <Field label="User count" name="userCount" type="number" min={0} defaultValue={contract?.userCount ?? ""} />

        <div>
          <label htmlFor="renewalStatus" className="block text-sm font-medium text-zinc-700 mb-1">
            Renewal status
          </label>
          <select
            id="renewalStatus"
            name="renewalStatus"
            defaultValue={contract?.renewalStatus ?? "ACTIVE"}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <p className="text-xs text-zinc-400 mt-1">
            &ldquo;Due Soon&rdquo;/&ldquo;Expired&rdquo; are computed automatically from the contract end date.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Contract start"
          name="contractStart"
          type="date"
          defaultValue={toDateInputValue(contract?.contractStart)}
          required
        />
        <Field
          label="Contract end"
          name="contractEnd"
          type="date"
          defaultValue={toDateInputValue(contract?.contractEnd)}
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={contract?.notes ?? ""}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-zinc-900 text-white text-sm font-medium px-4 py-2 hover:bg-zinc-800 transition-colors"
      >
        Save contract
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  min?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-zinc-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
