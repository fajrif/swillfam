import { MediaMentionForm } from "@/components/admin/MediaMentionForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createMediaMentionAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewMediaMentionPage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Media Mention" backHref="/admin/media-mentions" />
      <Card>
        <MediaMentionForm action={createMediaMentionAction} />
      </Card>
    </div>
  );
}
