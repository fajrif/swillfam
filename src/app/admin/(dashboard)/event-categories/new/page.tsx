import { NameForm } from "@/components/admin/NameForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createEventCategoryAction } from "../actions";

export default function NewEventCategoryPage() {
  return (
    <div>
      <EditHeader title="New Event Category" backHref="/admin/event-categories" />
      <Card>
        <NameForm action={createEventCategoryAction} />
      </Card>
    </div>
  );
}
