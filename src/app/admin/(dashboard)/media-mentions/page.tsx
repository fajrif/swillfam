import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { formatDay } from "@/lib/date";

export default async function MediaMentionsPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search
    ? { title: { contains: search, mode: "insensitive" as const } }
    : undefined;
  const mentions = await prisma.mediaMention.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { publishedDate: "desc" },
  });

  return (
    <div>
      <PageHeader title="Media Mentions" newHref="/admin/media-mentions/new" newLabel="New media mention" />
      <Card>
        <AdminTable
          rows={mentions}
          getKey={(m) => m.id}
          empty="No media mentions yet."
          columns={[
            {
              header: "Title",
              cell: (m) => (
                <Link
                  href={`/admin/media-mentions/${m.id}`}
                  className="font-medium text-zinc-900 hover:underline"
                >
                  {m.title}
                </Link>
              ),
            },
            { header: "Article title", cell: (m) => m.articleTitle },
            { header: "Publication", cell: (m) => m.publicationName },
            { header: "Date", cell: (m) => formatDay(m.publishedDate) },
          ]}
        />
      </Card>
    </div>
  );
}
