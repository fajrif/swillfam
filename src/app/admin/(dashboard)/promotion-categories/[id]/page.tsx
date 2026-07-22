import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NameForm } from "@/components/admin/NameForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updatePromotionCategoryAction, deletePromotionCategoryAction } from "../actions";

export default async function EditPromotionCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.promotionCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <EditHeader title="Edit Promotion Category" backHref="/admin/promotion-categories" />
      <Card>
        <NameForm action={updatePromotionCategoryAction.bind(null, id)} name={category.name} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deletePromotionCategoryAction.bind(null, id)} label="Delete category" />
        </div>
      </Card>
    </div>
  );
}
