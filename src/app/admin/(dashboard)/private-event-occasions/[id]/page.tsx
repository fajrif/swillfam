import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PrivateEventOccasionForm } from "@/components/admin/PrivateEventOccasionForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import {
  updatePrivateEventOccasionAction,
  deletePrivateEventOccasionAction,
} from "../actions";

export default async function EditPrivateEventOccasionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [occasion, privateEvents] = await Promise.all([
    prisma.privateEventOccasion.findUnique({ where: { id } }),
    prisma.privateEvent.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true } }),
  ]);
  if (!occasion) notFound();

  return (
    <div>
      <EditHeader title="Edit Occasion" backHref="/admin/private-event-occasions" />
      <Card>
        <PrivateEventOccasionForm
          action={updatePrivateEventOccasionAction.bind(null, id)}
          occasion={occasion}
          privateEvents={privateEvents}
        />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton
            action={deletePrivateEventOccasionAction.bind(null, id)}
            label="Delete occasion"
          />
        </div>
      </Card>
    </div>
  );
}
