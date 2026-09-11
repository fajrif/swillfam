import { prisma } from "@/lib/prisma";
import { requireAdmin, lockedVenue } from "@/lib/admin-auth";
import { EventForm } from "@/components/admin/EventForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createEventAction } from "../actions";

export default async function NewEventPage() {
  const admin = await requireAdmin();
  const [venues, categories, talents] = await Promise.all([
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.eventCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.talent.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, status: true } }),
  ]);

  return (
    <div>
      <EditHeader title="New Event" backHref="/admin/events" />
      <Card>
        <EventForm
          action={createEventAction}
          venues={venues}
          categories={categories}
          talents={talents}
          operatorVenue={lockedVenue(admin)}
        />
      </Card>
    </div>
  );
}
