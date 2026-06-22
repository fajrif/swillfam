import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Thumb } from "@/components/admin/Thumb";

export default async function GalleriesPage() {
  const galleries = await prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Galleries" newHref="/admin/galleries/new" newLabel="New gallery" />
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
      </Card>
    </div>
  );
}
