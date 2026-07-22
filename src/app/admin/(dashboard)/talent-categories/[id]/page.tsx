import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NameForm } from "@/components/admin/NameForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateTalentCategoryAction, deleteTalentCategoryAction } from "../actions";

export default async function EditTalentCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.talentCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <EditHeader title="Edit Talent Category" backHref="/admin/talent-categories" />
      <Card>
        <NameForm action={updateTalentCategoryAction.bind(null, id)} name={category.name} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteTalentCategoryAction.bind(null, id)} label="Delete category" />
        </div>
      </Card>
    </div>
  );
}
