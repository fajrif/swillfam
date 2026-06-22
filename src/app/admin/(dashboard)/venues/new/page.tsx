import { prisma } from "@/lib/prisma";
import { VenueForm } from "@/components/admin/VenueForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createVenueAction } from "../actions";

export default async function NewVenuePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <EditHeader title="New Venue" backHref="/admin/venues" />
      <Card>
        <VenueForm action={createVenueAction} categories={categories} />
      </Card>
    </div>
  );
}
