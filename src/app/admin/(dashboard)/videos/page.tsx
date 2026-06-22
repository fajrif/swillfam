import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Thumb } from "@/components/admin/Thumb";

export default async function VideosPage() {
  const videos = await prisma.video.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Videos" newHref="/admin/videos/new" newLabel="New video" />
      <Card>
        <AdminTable
          rows={videos}
          getKey={(v) => v.id}
          empty="No videos yet."
          columns={[
            { header: "", cell: (v) => <Thumb src={v.image} alt={v.title} />, className: "w-12" },
            {
              header: "Title",
              cell: (v) => (
                <Link href={`/admin/videos/${v.id}`} className="font-medium text-zinc-900 hover:underline">
                  {v.title}
                </Link>
              ),
            },
            {
              header: "URL",
              cell: (v) => (
                <span className="text-xs text-zinc-400 break-all">{v.videoUrl}</span>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
