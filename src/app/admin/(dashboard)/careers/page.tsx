import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { EMPLOYMENT_OPTIONS } from "@/components/admin/CareerForm";

const employmentLabel = (v: string) => EMPLOYMENT_OPTIONS.find((o) => o.value === v)?.label ?? v;

export default async function CareersPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { jobTitle: { contains: search, mode: "insensitive" as const } } : undefined;
  const careers = await prisma.career.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
    })
  const total = await prisma.career.count({ where });

  return (
    <div>
      <PageHeader title="Careers" newHref="/admin/careers/new" newLabel="New career" />
      <SearchInput placeholder="Search by job title..." />
      <Card>
        <AdminTable
          rows={careers}
          getKey={(c) => c.id}
          empty="No careers yet."
          columns={[
            {
              header: "Job title",
              cell: (c) => (
                <>
                  <Link href={`/admin/careers/${c.id}`} className="font-medium text-zinc-900 hover:underline">
                    {c.jobTitle}
                  </Link>
                  <div className="text-xs text-zinc-400">{c.department}</div>
                </>
              ),
            },
            { header: "Type", cell: (c) => employmentLabel(c.employmentType) },
            { header: "Location", cell: (c) => c.location },
            { header: "Applications", cell: (c) => c._count.applications },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
