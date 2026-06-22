import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SegmentGalleryForm } from "@/components/admin/SegmentGalleryForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateSegmentGalleryAction, deleteSegmentGalleryAction } from "../actions";

export default async function EditSegmentGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [segmentGallery, venues] = await Promise.all([
    prisma.segmentGallery.findUnique({ where: { id } }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!segmentGallery) notFound();

  return (
    <div>
      <EditHeader title="Edit Segment Gallery" backHref="/admin/segment-galleries" />
      <Card>
        <SegmentGalleryForm
          action={updateSegmentGalleryAction.bind(null, id)}
          segmentGallery={segmentGallery}
          venues={venues}
        />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteSegmentGalleryAction.bind(null, id)} label="Delete segment gallery" />
        </div>
      </Card>
    </div>
  );
}
