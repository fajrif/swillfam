import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, assertVenueOwnership, isAdministrator } from "@/lib/admin-auth";
import { VenueForm } from "@/components/admin/VenueForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateVenueAction, deleteVenueAction } from "../../actions";
import { getImageAltRecord } from "@/lib/image-alt";

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const altsByPath = await getImageAltRecord();
  const { id } = await params;
  const admin = await requireAdmin();
  assertVenueOwnership(admin, id);
  const [venue, categories] = await Promise.all([
    prisma.venue.findUnique({
      where: { id },
      include: { hours: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!venue) notFound();

  return (
    <div>
      <EditHeader title={`Edit ${venue.name}`} backHref={`/admin/venues/${id}`} />
      <Card>
        <VenueForm
          altsByPath={altsByPath}
          action={updateVenueAction.bind(null, id)}
          venue={venue}
          hours={venue.hours}
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
