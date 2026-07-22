import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Thumb } from "@/components/admin/Thumb";

export default async function GalleriesPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { title: { contains: search, mode: "insensitive" as const } } : undefined;
  const galleries = await prisma.gallery.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    })
  const total = await prisma.gallery.count({ where });

  return (
    <div>
      <PageHeader title="Galleries" newHref="/admin/galleries/new" newLabel="New gallery" />
      <SearchInput placeholder="Search by title..." />
      <Card>
        <AdminTable
          rows={galleries}
          getKey={(g) => g.id}
          empty="No galleries yet."
          columns={[
            { header: "", cell: (g) => <Thumb src={g.image} alt={g.title} />, className: "w-12" },
            {
              header: "Title",
              cell: (g) => (
                <Link href={`/admin/galleries/${g.id}`} className="font-medium text-zinc-900 hover:underline">
                  {g.title}
                </Link>
              ),
            },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
