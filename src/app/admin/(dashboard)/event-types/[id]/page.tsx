import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PrivateEventTypeForm } from "@/components/admin/PrivateEventTypeForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updatePrivateEventTypeAction, deletePrivateEventTypeAction } from "../actions";

export default async function EditEventTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventType = await prisma.privateEventType.findUnique({ where: { id } });
  if (!eventType) notFound();

  return (
    <div>
      <EditHeader title="Edit Event Type" backHref="/admin/event-types" />
      <Card>
        <PrivateEventTypeForm action={updatePrivateEventTypeAction.bind(null, id)} eventType={eventType} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deletePrivateEventTypeAction.bind(null, id)} label="Delete event type" />
        </div>
      </Card>
    </div>
  );
}
