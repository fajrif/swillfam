import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoForm } from "@/components/admin/VideoForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateVideoAction, deleteVideoAction } from "../actions";

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) notFound();

  return (
    <div>
      <EditHeader title="Edit Video" backHref="/admin/videos" />
      <Card>
        <VideoForm action={updateVideoAction.bind(null, id)} video={video} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteVideoAction.bind(null, id)} label="Delete video" />
        </div>
      </Card>
    </div>
  );
}
