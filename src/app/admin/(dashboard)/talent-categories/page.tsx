import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";

export default async function TalentCategoriesPage() {
  const categories = await prisma.talentCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <PageHeader title="Talent Categories" newHref="/admin/talent-categories/new" newLabel="New category" />
      <Card>
        <AdminTable
          rows={categories}
          getKey={(c) => c.id}
          empty="No talent categories yet."
          columns={[
            {
              header: "Name",
              cell: (c) => (
                <Link href={`/admin/talent-categories/${c.id}`} className="font-medium text-zinc-900 hover:underline">
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
