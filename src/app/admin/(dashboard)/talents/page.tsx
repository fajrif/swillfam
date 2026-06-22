import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Thumb } from "@/components/admin/Thumb";

export default async function TalentsPage() {
  const talents = await prisma.talent.findMany({
    orderBy: { createdAt: "desc" },
    include: { venue: { select: { name: true } } },
  });

  return (
    <div>
      <PageHeader title="Talents" newHref="/admin/talents/new" newLabel="New talent" />
      <Card>
        <AdminTable
          rows={talents}
          getKey={(t) => t.id}
          empty="No talents yet."
          columns={[
            { header: "", cell: (t) => <Thumb src={t.image} alt={t.name} />, className: "w-12" },
            {
              header: "Name",
              cell: (t) => (
                <>
                  <Link href={`/admin/talents/${t.id}`} className="font-medium text-zinc-900 hover:underline">
                    {t.name}
                  </Link>
                  <div className="text-xs text-zinc-400">{t.speciality}</div>
                </>
              ),
            },
            { header: "Venue", cell: (t) => t.venue?.name ?? "—" },
          ]}
        />
      </Card>
    </div>
  );
}
