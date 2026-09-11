import { GalleryForm } from "@/components/admin/GalleryForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createGalleryAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewGalleryPage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Gallery" backHref="/admin/galleries" />
      <Card>
        <GalleryForm action={createGalleryAction} />
      </Card>
    </div>
  );
}
