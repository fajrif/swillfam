import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Inquiries</h1>
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <AdminTable
          rows={inquiries}
          getKey={(i) => i.id}
          empty="No inquiries yet."
          columns={[
            {
              header: "From",
              cell: (i) => (
                <>
                  <Link href={`/admin/inquiries/${i.id}`} className="font-medium text-zinc-900 hover:underline">
                    {i.fullName}
                  </Link>
                  <div className="text-xs text-zinc-400">{i.email}</div>
                </>
              ),
            },
            { header: "Subject", cell: (i) => i.subject },
            { header: "Status", cell: (i) => <StatusBadge status={i.status} /> },
            { header: "Received", cell: (i) => i.createdAt.toLocaleDateString(), className: "text-zinc-500" },
          ]}
        />
      </div>
    </div>
  );
}
