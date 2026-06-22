import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";

export default async function EventCategoriesPage() {
  const categories = await prisma.eventCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <PageHeader title="Event Categories" newHref="/admin/event-categories/new" newLabel="New category" />
      <Card>
        <AdminTable
          rows={categories}
          getKey={(c) => c.id}
          empty="No event categories yet."
          columns={[
            {
              header: "Name",
              cell: (c) => (
                <Link href={`/admin/event-categories/${c.id}`} className="font-medium text-zinc-900 hover:underline">
                  {c.name}
                </Link>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
