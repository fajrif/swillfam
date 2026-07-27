import { prisma } from "@/lib/prisma";
import { PrivateEventOccasionForm } from "@/components/admin/PrivateEventOccasionForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPrivateEventOccasionAction } from "../actions";

export default async function NewPrivateEventOccasionPage() {
  const privateEvents = await prisma.privateEvent.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div>
      <EditHeader title="New Occasion" backHref="/admin/private-event-occasions" />
      <Card>
        <PrivateEventOccasionForm
          action={createPrivateEventOccasionAction}
          privateEvents={privateEvents}
        />
      </Card>
    </div>
  );
}
