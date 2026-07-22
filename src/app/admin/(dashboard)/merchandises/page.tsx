import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Thumb } from "@/components/admin/Thumb";

export default async function MerchandisesPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;
  const merchandises = await prisma.merchandise.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    })
  const total = await prisma.merchandise.count({ where });

  return (
    <div>
      <PageHeader title="Merchandises" newHref="/admin/merchandises/new" newLabel="New merchandise" />
      <SearchInput placeholder="Search by name..." />
      <Card>
        <AdminTable
          rows={merchandises}
          getKey={(m) => m.id}
          empty="No merchandise yet."
          columns={[
            { header: "", cell: (m) => <Thumb src={m.image} alt={m.name} />, className: "w-12" },
            {
              header: "Name",
              cell: (m) => (
                <Link href={`/admin/merchandises/${m.id}`} className="font-medium text-zinc-900 hover:underline">
                  {m.name}
                </Link>
              ),
            },
            { header: "Price", cell: (m) => "IDR " + new Intl.NumberFormat("id-ID").format(Number(m.price)) },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
