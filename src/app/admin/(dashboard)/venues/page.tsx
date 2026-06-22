import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Thumb } from "@/components/admin/Thumb";

export default async function VenuesPage() {
  const venues = await prisma.venue.findMany({
    orderBy: { name: "asc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <div>
      <PageHeader title="Venues" newHref="/admin/venues/new" newLabel="New venue" />
      <Card>
        <AdminTable
          rows={venues}
          getKey={(v) => v.id}
          empty="No venues yet."
          columns={[
            { header: "", cell: (v) => <Thumb src={v.image} alt={v.name} />, className: "w-12" },
            {
              header: "Name",
              cell: (v) => (
                <>
                  <Link href={`/admin/venues/${v.id}`} className="font-medium text-zinc-900 hover:underline">
                    {v.name}
                  </Link>
                  <div className="text-xs text-zinc-400">/{v.slug}</div>
                </>
              ),
            },
            { header: "Category", cell: (v) => v.category?.name ?? "—" },
            { header: "Location", cell: (v) => <span className="text-zinc-500">{v.location}</span> },
          ]}
        />
      </Card>
    </div>
  );
}
