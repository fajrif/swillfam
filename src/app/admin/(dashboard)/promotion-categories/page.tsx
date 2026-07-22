import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";

export default async function PromotionCategoriesPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;
  const categories = await prisma.promotionCategory.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { name: "asc" },
    include: { _count: { select: { promotions: true } } },
    })
  const total = await prisma.promotionCategory.count({ where });

  return (
    <div>
      <PageHeader title="Promotion Categories" newHref="/admin/promotion-categories/new" newLabel="New category" />
      <SearchInput placeholder="Search by name..." />
      <Card>
        <AdminTable
          rows={categories}
          getKey={(c) => c.id}
          empty="No promotion categories yet."
          columns={[
            {
              header: "Name",
              cell: (c) => (
                <Link href={`/admin/promotion-categories/${c.id}`} className="font-medium text-zinc-900 hover:underline">
                  {c.name}
                </Link>
              ),
            },
            { header: "Promotions", cell: (c) => c._count.promotions },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
