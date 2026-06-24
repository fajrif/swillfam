import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Thumb } from "@/components/admin/Thumb";

export default async function EventTypesPage() {
  const eventTypes = await prisma.privateEventType.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <PageHeader title="Event Types" newHref="/admin/event-types/new" newLabel="New event type" />
      <Card>
        <AdminTable
          rows={eventTypes}
          getKey={(t) => t.id}
          empty="No event types yet."
          columns={[
            { header: "", cell: (t) => <Thumb src={t.image} alt={t.title} />, className: "w-12" },
            {
              header: "Title",
              cell: (t) => (
                <Link href={`/admin/event-types/${t.id}`} className="font-medium text-zinc-900 hover:underline">
                  {t.title}
                </Link>
              ),
            },
            { header: "Order", cell: (t) => <span className="text-zinc-500">{t.sortOrder}</span> },
            {
              header: "Status",
              cell: (t) => <span className="text-xs text-zinc-500">{t.published ? "Published" : "Hidden"}</span>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
