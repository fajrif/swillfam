import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, assertVenueOwnership, isAdministrator } from "@/lib/admin-auth";
import { VenueForm } from "@/components/admin/VenueForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateVenueAction, deleteVenueAction } from "../../actions";

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await requireAdmin();
  assertVenueOwnership(admin, id);
  const [venue, categories] = await Promise.all([
    prisma.venue.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!venue) notFound();

  return (
    <div>
      <EditHeader title={`Edit ${venue.name}`} backHref={`/admin/venues/${id}`} />
      <Card>
        <VenueForm
          action={updateVenueAction.bind(null, id)}
          venue={venue}
          categories={categories}
          lockIdentity={!isAdministrator(admin)}
        />
        {isAdministrator(admin) && (
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <ConfirmDeleteButton action={deleteVenueAction.bind(null, id)} label="Delete venue" />
          </div>
        )}
      </Card>
    </div>
  );
}
