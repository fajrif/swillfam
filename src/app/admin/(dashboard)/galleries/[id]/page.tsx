import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateGalleryAction, deleteGalleryAction } from "../actions";

export default async function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gallery = await prisma.gallery.findUnique({ where: { id } });
  if (!gallery) notFound();

  return (
    <div>
      <EditHeader title="Edit Gallery" backHref="/admin/galleries" />
      <Card>
        <GalleryForm action={updateGalleryAction.bind(null, id)} gallery={gallery} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteGalleryAction.bind(null, id)} label="Delete gallery" />
        </div>
      </Card>
    </div>
  );
}
