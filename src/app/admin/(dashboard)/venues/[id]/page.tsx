import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VenueForm } from "@/components/admin/VenueForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateVenueAction, deleteVenueAction } from "../actions";

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [venue, categories] = await Promise.all([
    prisma.venue.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!venue) notFound();

  return (
    <div>
      <EditHeader title="Edit Venue" backHref="/admin/venues" />
      <Card>
        <VenueForm action={updateVenueAction.bind(null, id)} venue={venue} categories={categories} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteVenueAction.bind(null, id)} label="Delete venue" />
        </div>
      </Card>
    </div>
  );
}
