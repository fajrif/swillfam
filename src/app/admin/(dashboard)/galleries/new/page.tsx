import { GalleryForm } from "@/components/admin/GalleryForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createGalleryAction } from "../actions";

export default function NewGalleryPage() {
  return (
    <div>
      <EditHeader title="New Gallery" backHref="/admin/galleries" />
      <Card>
        <GalleryForm action={createGalleryAction} />
      </Card>
    </div>
  );
}
