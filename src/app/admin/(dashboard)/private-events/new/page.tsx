import { prisma } from "@/lib/prisma";
import { PrivateEventForm } from "@/components/admin/PrivateEventForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPrivateEventAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewPrivateEventPage() {
  await requireAdministrator();
  const [eventTypes, venues] = await Promise.all([
    prisma.privateEventType.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true },
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <EditHeader title="New Private Event" backHref="/admin/private-events" />
      <Card>
        <PrivateEventForm action={createPrivateEventAction} eventTypes={eventTypes} venues={venues} />
      </Card>
    </div>
  );
}
