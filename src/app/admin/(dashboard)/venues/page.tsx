import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Thumb } from "@/components/admin/Thumb";

export default async function VenuesPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;
  const venues = await prisma.venue.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { name: "asc" },
    include: { category: { select: { name: true } } },
    })
  const total = await prisma.venue.count({ where });

  return (
    <div>
      <PageHeader title="Venues" newHref="/admin/venues/new" newLabel="New venue" />
      <SearchInput placeholder="Search by name..." />
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
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
