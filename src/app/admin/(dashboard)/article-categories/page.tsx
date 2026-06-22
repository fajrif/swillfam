import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";

export default async function ArticleCategoriesPage() {
  const categories = await prisma.articleCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <PageHeader title="Article Categories" newHref="/admin/article-categories/new" newLabel="New category" />
      <Card>
        <AdminTable
          rows={categories}
          getKey={(c) => c.id}
          empty="No article categories yet."
          columns={[
            {
              header: "Name",
              cell: (c) => (
                <Link href={`/admin/article-categories/${c.id}`} className="font-medium text-zinc-900 hover:underline">
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
