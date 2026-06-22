import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Thumb } from "@/components/admin/Thumb";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { venues: true } } },
  });

  return (
    <div>
      <PageHeader title="Venue Categories" newHref="/admin/categories/new" newLabel="New category" />
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
      </Card>
    </div>
  );
}
