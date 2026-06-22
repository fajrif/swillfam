import { prisma } from "@/lib/prisma";
import { SegmentGalleryForm } from "@/components/admin/SegmentGalleryForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createSegmentGalleryAction } from "../actions";

export default async function NewSegmentGalleryPage() {
  const venues = await prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <EditHeader title="New Segment Gallery" backHref="/admin/segment-galleries" />
      <Card>
        <SegmentGalleryForm action={createSegmentGalleryAction} venues={venues} />
      </Card>
    </div>
  );
}
