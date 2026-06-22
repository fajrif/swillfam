import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Thumb } from "@/components/admin/Thumb";

export default async function PromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { startDate: "desc" },
    include: { venue: { select: { name: true } } },
  });

  return (
    <div>
      <PageHeader title="Promotions" newHref="/admin/promotions/new" newLabel="New promotion" />
      <Card>
        <AdminTable
          rows={promotions}
          getKey={(p) => p.id}
          empty="No promotions yet."
          columns={[
            { header: "", cell: (p) => <Thumb src={p.image} alt={p.name} />, className: "w-12" },
            {
              header: "Name",
              cell: (p) => (
                <>
                  <Link href={`/admin/promotions/${p.id}`} className="font-medium text-zinc-900 hover:underline">
                    {p.name}
                  </Link>
                  <div className="text-xs text-zinc-400">{p.venue?.name ?? "—"}</div>
                </>
              ),
            },
            {
              header: "Runs",
              cell: (p) => (
                <span className="text-zinc-500">
                  {p.startDate.toLocaleDateString()} – {p.endDate.toLocaleDateString()}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
