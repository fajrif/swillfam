import { VideoForm } from "@/components/admin/VideoForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createVideoAction } from "../actions";

export default function NewVideoPage() {
  return (
    <div>
      <EditHeader title="New Video" backHref="/admin/videos" />
      <Card>
        <VideoForm action={createVideoAction} />
      </Card>
    </div>
  );
}
