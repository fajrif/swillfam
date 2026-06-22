import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { career: { select: { jobTitle: true } } },
  });

  return (
    <div>
      <PageHeader title="Applications" />
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
