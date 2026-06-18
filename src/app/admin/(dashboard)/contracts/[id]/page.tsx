import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContractForm } from "@/components/admin/ContractForm";
import { updateContractAction } from "../actions";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = await prisma.clientContract.findUnique({ where: { id } });
  if (!contract) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Edit Client Contract</h1>
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <ContractForm contract={contract} action={updateContractAction.bind(null, id)} />
      </div>
    </div>
  );
}
