import { MediaMentionForm } from "@/components/admin/MediaMentionForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createMediaMentionAction } from "../actions";

export default function NewMediaMentionPage() {
  return (
    <div>
      <EditHeader title="New Media Mention" backHref="/admin/media-mentions" />
      <Card>
        <MediaMentionForm action={createMediaMentionAction} />
      </Card>
    </div>
  );
}
