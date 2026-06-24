import { prisma } from "@/lib/prisma";
import { PrivateEventForm } from "@/components/admin/PrivateEventForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPrivateEventAction } from "../actions";

export default async function NewPrivateEventPage() {
  const eventTypes = await prisma.privateEventType.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div>
      <EditHeader title="New Private Event" backHref="/admin/private-events" />
      <Card>
        <PrivateEventForm action={createPrivateEventAction} eventTypes={eventTypes} />
      </Card>
    </div>
  );
}
