import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function InquiriesPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search
    ? {
        OR: [
          { fullName: { contains: search, mode: "insensitive" as const } },
          { subject: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;
  const inquiries = await prisma.inquiry.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    })
  const total = await prisma.inquiry.count({ where });

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Inquiries</h1>
      <SearchInput placeholder="Search by name or subject..." />
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
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </div>
    </div>
  );
}
