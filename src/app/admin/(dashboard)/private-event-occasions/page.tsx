import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Thumb } from "@/components/admin/Thumb";

export default async function PrivateEventOccasionsPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { title: { contains: search, mode: "insensitive" as const } } : undefined;
  const [occasions, total] = await Promise.all([
    prisma.privateEventOccasion.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { privateEvent: { select: { title: true } } },
    }),
    prisma.privateEventOccasion.count({ where }),
  ]);

  return (
    <div>
      <PageHeader
        title="Private Event Occasions"
        newHref="/admin/private-event-occasions/new"
        newLabel="New occasion"
      />
      <SearchInput placeholder="Search by title..." />
      <Card>
        <AdminTable
          rows={occasions}
          getKey={(o) => o.id}
          empty="No occasions yet."
          columns={[
            { header: "", cell: (o) => <Thumb src={o.image} alt={o.title} />, className: "w-12" },
            {
              header: "Title",
              cell: (o) => (
                <Link
                  href={`/admin/private-event-occasions/${o.id}`}
                  className="font-medium text-zinc-900 hover:underline"
                >
                  {o.title}
                </Link>
              ),
            },
            { header: "Private event", cell: (o) => o.privateEvent?.title ?? "—" },
            { header: "Status", cell: (o) => (o.published ? "Published" : "Draft") },
            { header: "Order", cell: (o) => o.sortOrder },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
