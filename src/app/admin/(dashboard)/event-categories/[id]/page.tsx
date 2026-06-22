import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NameForm } from "@/components/admin/NameForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateEventCategoryAction, deleteEventCategoryAction } from "../actions";

export default async function EditEventCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.eventCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <EditHeader title="Edit Event Category" backHref="/admin/event-categories" />
      <Card>
        <NameForm action={updateEventCategoryAction.bind(null, id)} name={category.name} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteEventCategoryAction.bind(null, id)} label="Delete category" />
        </div>
      </Card>
    </div>
  );
}
