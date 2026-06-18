import Link from "next/link";
import type { Inquiry } from "@/generated/prisma/client";
import { PackageBadge } from "@/components/admin/PackageBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";

export function InquiryTable({ inquiries }: { inquiries: Inquiry[] }) {
  if (inquiries.length === 0) {
    return <p className="text-sm text-zinc-500">No inquiries yet.</p>;
  }

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-zinc-200 text-left text-zinc-500">
          <th className="py-2 pr-4 font-medium">Business</th>
          <th className="py-2 pr-4 font-medium">Contact</th>
          <th className="py-2 pr-4 font-medium">Package</th>
          <th className="py-2 pr-4 font-medium">Expected Users</th>
          <th className="py-2 pr-4 font-medium">Status</th>
          <th className="py-2 pr-4 font-medium">Received</th>
        </tr>
      </thead>
      <tbody>
        {inquiries.map((inquiry) => (
          <tr key={inquiry.id} className="border-b border-zinc-100 hover:bg-zinc-50">
            <td className="py-3 pr-4">
              <Link href={`/admin/inquiries/${inquiry.id}`} className="font-medium text-zinc-900 hover:underline">
                {inquiry.businessName}
              </Link>
            </td>
            <td className="py-3 pr-4 text-zinc-600">
              {inquiry.contactName}
              <div className="text-xs text-zinc-400">{inquiry.email}</div>
            </td>
            <td className="py-3 pr-4">
              <PackageBadge value={inquiry.packageInterest} />
            </td>
            <td className="py-3 pr-4 text-zinc-600">{inquiry.expectedUsers ?? "—"}</td>
            <td className="py-3 pr-4">
              <StatusBadge status={inquiry.status} />
            </td>
            <td className="py-3 pr-4 text-zinc-500">{inquiry.createdAt.toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
