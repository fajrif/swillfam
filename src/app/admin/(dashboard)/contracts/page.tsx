import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ContractTable } from "@/components/admin/ContractTable";

export default async function ContractsPage() {
  const contracts = await prisma.clientContract.findMany({ orderBy: { contractEnd: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Client Contracts</h1>
        <Link
          href="/admin/contracts/new"
          className="rounded-md bg-zinc-900 text-white text-sm font-medium px-4 py-2 hover:bg-zinc-800 transition-colors"
        >
          New contract
        </Link>
      </div>
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <ContractTable contracts={contracts} />
      </div>
    </div>
  );
}
