import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Thumb } from "@/components/admin/Thumb";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedDate: "desc" },
    include: { articleCategory: { select: { name: true } } },
  });

  return (
    <div>
      <PageHeader title="Articles" newHref="/admin/articles/new" newLabel="New article" />
      <Card>
        <AdminTable
          rows={articles}
          getKey={(a) => a.id}
          empty="No articles yet."
          columns={[
            { header: "", cell: (a) => <Thumb src={a.image} alt={a.title} />, className: "w-12" },
            {
              header: "Title",
              cell: (a) => (
                <>
                  <Link href={`/admin/articles/${a.id}`} className="font-medium text-zinc-900 hover:underline">
                    {a.title}
                  </Link>
                  <div className="text-xs text-zinc-400">{a.articleCategory?.name ?? "Uncategorized"}</div>
                </>
              ),
            },
            {
              header: "Status",
              cell: (a) =>
                a.status === 1 ? (
                  <span className="inline-flex items-center rounded-full text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700">
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full text-xs font-medium px-2.5 py-1 bg-zinc-100 text-zinc-600">
                    Draft
                  </span>
                ),
            },
            { header: "Published", cell: (a) => a.publishedDate.toLocaleDateString(), className: "text-zinc-500" },
          ]}
        />
      </Card>
    </div>
  );
}
