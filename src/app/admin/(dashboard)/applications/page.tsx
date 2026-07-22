import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";

export default async function ApplicationsPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { fullName: { contains: search, mode: "insensitive" as const } } : undefined;
  const applications = await prisma.application.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: { career: { select: { jobTitle: true } } },
    })
  const total = await prisma.application.count({ where });

  return (
    <div>
      <PageHeader title="Applications" />
      <SearchInput placeholder="Search by name..." />
      <Card>
        <AdminTable
          rows={applications}
          getKey={(a) => a.id}
          empty="No applications yet."
          columns={[
            {
              header: "Applicant",
              cell: (a) => (
                <>
                  <Link href={`/admin/applications/${a.id}`} className="font-medium text-zinc-900 hover:underline">
                    {a.fullName}
                  </Link>
                  <div className="text-xs text-zinc-400">{a.email}</div>
                </>
              ),
            },
            { header: "Applied for", cell: (a) => a.career?.jobTitle ?? "—" },
            { header: "Received", cell: (a) => a.createdAt.toLocaleDateString(), className: "text-zinc-500" },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
