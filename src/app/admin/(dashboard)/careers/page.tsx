import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { EMPLOYMENT_OPTIONS } from "@/components/admin/CareerForm";

const employmentLabel = (v: string) => EMPLOYMENT_OPTIONS.find((o) => o.value === v)?.label ?? v;

export default async function CareersPage() {
  const careers = await prisma.career.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <div>
      <PageHeader title="Careers" newHref="/admin/careers/new" newLabel="New career" />
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
      </Card>
    </div>
  );
}
