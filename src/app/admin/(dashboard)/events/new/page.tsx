import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/EventForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createEventAction } from "../actions";

export default async function NewEventPage() {
  const [venues, categories] = await Promise.all([
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.eventCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <EditHeader title="New Event" backHref="/admin/events" />
      <Card>
        <EventForm action={createEventAction} venues={venues} categories={categories} />
      </Card>
    </div>
  );
}
