import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MediaMentionForm } from "@/components/admin/MediaMentionForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateMediaMentionAction, deleteMediaMentionAction } from "../actions";

export default async function EditMediaMentionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mediaMention = await prisma.mediaMention.findUnique({ where: { id } });
  if (!mediaMention) notFound();

  return (
    <div>
      <EditHeader title="Edit Media Mention" backHref="/admin/media-mentions" />
      <Card>
        <MediaMentionForm
          action={updateMediaMentionAction.bind(null, id)}
          mediaMention={mediaMention}
        />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton
            action={deleteMediaMentionAction.bind(null, id)}
            label="Delete media mention"
          />
        </div>
      </Card>
    </div>
  );
}
