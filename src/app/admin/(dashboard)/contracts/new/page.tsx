import { ContractForm } from "@/components/admin/ContractForm";
import { createContractAction } from "../actions";

export default function NewContractPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">New Client Contract</h1>
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <ContractForm action={createContractAction} />
      </div>
    </div>
  );
}
