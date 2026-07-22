import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";

export default async function ApplicationsPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const applications = await prisma.application.findMany({
    where: search ? { fullName: { contains: search, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
    include: { career: { select: { jobTitle: true } } },
  });

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
      </Card>
    </div>
  );
}
