import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Thumb } from "@/components/admin/Thumb";

export default async function SegmentGalleriesPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const galleries = await prisma.segmentGallery.findMany({
    where: search ? { title: { contains: search, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
    include: { venue: { select: { name: true } } },
  });

  return (
    <div>
      <PageHeader title="Segment Galleries" newHref="/admin/segment-galleries/new" newLabel="New segment gallery" />
      <SearchInput placeholder="Search by title..." />
      <Card>
        <AdminTable
          rows={galleries}
          getKey={(g) => g.id}
          empty="No segment galleries yet."
          columns={[
            { header: "", cell: (g) => <Thumb src={g.images[0]} alt={g.title} />, className: "w-12" },
            {
              header: "Title",
              cell: (g) => (
                <>
                  <Link href={`/admin/segment-galleries/${g.id}`} className="font-medium text-zinc-900 hover:underline">
                    {g.title}
                  </Link>
                  <div className="text-xs text-zinc-400">{g.images.length} image(s)</div>
                </>
              ),
            },
            { header: "Venue", cell: (g) => g.venue?.name ?? "—" },
            { header: "Special", cell: (g) => (g.special ? "Yes" : "—") },
          ]}
        />
      </Card>
    </div>
  );
}
