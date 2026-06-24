import { PrivateEventTypeForm } from "@/components/admin/PrivateEventTypeForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPrivateEventTypeAction } from "../actions";

export default function NewEventTypePage() {
  return (
    <div>
      <EditHeader title="New Event Type" backHref="/admin/event-types" />
      <Card>
        <PrivateEventTypeForm action={createPrivateEventTypeAction} />
      </Card>
    </div>
  );
}
