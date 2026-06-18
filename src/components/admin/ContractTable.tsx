import Link from "next/link";
import type { ClientContract } from "@/generated/prisma/client";
import { PackageBadge } from "@/components/admin/PackageBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { computeRenewalBadge } from "@/lib/contract-status";

export function ContractTable({ contracts }: { contracts: ClientContract[] }) {
  if (contracts.length === 0) {
    return <p className="text-sm text-zinc-500">No client contracts yet.</p>;
  }

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-zinc-200 text-left text-zinc-500">
          <th className="py-2 pr-4 font-medium">Business</th>
          <th className="py-2 pr-4 font-medium">Server Domain</th>
          <th className="py-2 pr-4 font-medium">Package</th>
          <th className="py-2 pr-4 font-medium">Users</th>
          <th className="py-2 pr-4 font-medium">Contract End</th>
          <th className="py-2 pr-4 font-medium">Renewal</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map((contract) => (
          <tr key={contract.id} className="border-b border-zinc-100 hover:bg-zinc-50">
            <td className="py-3 pr-4">
              <Link href={`/admin/contracts/${contract.id}`} className="font-medium text-zinc-900 hover:underline">
                {contract.businessName}
              </Link>
              <div className="text-xs text-zinc-400">{contract.contactName}</div>
            </td>
            <td className="py-3 pr-4 text-zinc-600">{contract.serverDomain}</td>
            <td className="py-3 pr-4">
              <PackageBadge value={contract.package} />
            </td>
            <td className="py-3 pr-4 text-zinc-600">{contract.userCount ?? "—"}</td>
            <td className="py-3 pr-4 text-zinc-500">{contract.contractEnd.toLocaleDateString()}</td>
            <td className="py-3 pr-4">
              <StatusBadge status={computeRenewalBadge(contract.contractEnd, contract.renewalStatus)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
