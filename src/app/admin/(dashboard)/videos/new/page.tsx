import { VideoForm } from "@/components/admin/VideoForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createVideoAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewVideoPage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Video" backHref="/admin/videos" />
      <Card>
        <VideoForm action={createVideoAction} />
      </Card>
    </div>
  );
}
