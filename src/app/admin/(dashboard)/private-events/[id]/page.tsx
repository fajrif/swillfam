import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PrivateEventForm } from "@/components/admin/PrivateEventForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updatePrivateEventAction, deletePrivateEventAction } from "../actions";

export default async function EditPrivateEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [privateEvent, eventTypes, venues] = await Promise.all([
    prisma.privateEvent.findUnique({
      where: { id },
      include: { venues: { select: { id: true } } },
    }),
    prisma.privateEventType.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true } }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!privateEvent) notFound();

  return (
    <div>
      <EditHeader title="Edit Private Event" backHref="/admin/private-events" />
      <Card>
        <PrivateEventForm
          action={updatePrivateEventAction.bind(null, id)}
          privateEvent={privateEvent}
          eventTypes={eventTypes}
          venues={venues}
          selectedVenueIds={privateEvent.venues.map((v) => v.id)}
        />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deletePrivateEventAction.bind(null, id)} label="Delete private event" />
        </div>
      </Card>
    </div>
  );
}
