import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Thumb } from "@/components/admin/Thumb";

export default async function CategoriesPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;
  const categories = await prisma.category.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { name: "asc" },
    include: { _count: { select: { venues: true } } },
    })
  const total = await prisma.category.count({ where });

  return (
    <div>
      <PageHeader title="Venue Categories" newHref="/admin/categories/new" newLabel="New category" />
      <SearchInput placeholder="Search by name..." />
      <Card>
        <AdminTable
          rows={categories}
          getKey={(c) => c.id}
          empty="No categories yet."
          columns={[
            { header: "", cell: (c) => <Thumb src={c.image} alt={c.name} />, className: "w-12" },
            {
              header: "Name",
              cell: (c) => (
                <>
                  <Link href={`/admin/categories/${c.id}`} className="font-medium text-zinc-900 hover:underline">
                    {c.name}
                  </Link>
                  <div className="text-xs text-zinc-400">/{c.slug}</div>
                </>
              ),
            },
            { header: "Venues", cell: (c) => c._count.venues },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
