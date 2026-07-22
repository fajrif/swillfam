import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Thumb } from "@/components/admin/Thumb";

export default async function PrivateEventsPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const privateEvents = await prisma.privateEvent.findMany({
    where: search ? { title: { contains: search, mode: "insensitive" } } : undefined,
    orderBy: { sortOrder: "asc" },
    include: { privateEventType: { select: { title: true } } },
  });

  return (
    <div>
      <PageHeader title="Private Events" newHref="/admin/private-events/new" newLabel="New private event" />
      <SearchInput placeholder="Search by title..." />
      <Card>
        <AdminTable
          rows={privateEvents}
          getKey={(e) => e.id}
          empty="No private events yet."
          columns={[
            { header: "", cell: (e) => <Thumb src={e.image} alt={e.title} />, className: "w-12" },
            {
              header: "Title",
              cell: (e) => (
                <>
                  <Link href={`/admin/private-events/${e.id}`} className="font-medium text-zinc-900 hover:underline">
                    {e.title}
                  </Link>
                  <div className="text-xs text-zinc-400">{e.privateEventType?.title ?? "—"}</div>
                </>
              ),
            },
            { header: "Order", cell: (e) => <span className="text-zinc-500">{e.sortOrder}</span> },
            {
              header: "Status",
              cell: (e) => <span className="text-xs text-zinc-500">{e.published ? "Published" : "Hidden"}</span>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
