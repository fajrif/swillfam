import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";

export default async function ArticleCategoriesPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const categories = await prisma.articleCategory.findMany({
    where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader title="Article Categories" newHref="/admin/article-categories/new" newLabel="New category" />
      <SearchInput placeholder="Search by name..." />
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
