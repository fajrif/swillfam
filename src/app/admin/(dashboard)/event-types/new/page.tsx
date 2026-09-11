import { PrivateEventTypeForm } from "@/components/admin/PrivateEventTypeForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPrivateEventTypeAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewEventTypePage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Event Type" backHref="/admin/event-types" />
      <Card>
        <PrivateEventTypeForm action={createPrivateEventTypeAction} />
      </Card>
    </div>
  );
}
