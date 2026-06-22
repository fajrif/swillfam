import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updatePromotionAction, deletePromotionAction } from "../actions";

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [promotion, venues] = await Promise.all([
    prisma.promotion.findUnique({ where: { id } }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!promotion) notFound();

  return (
    <div>
      <EditHeader title="Edit Promotion" backHref="/admin/promotions" />
      <Card>
        <PromotionForm action={updatePromotionAction.bind(null, id)} promotion={promotion} venues={venues} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deletePromotionAction.bind(null, id)} label="Delete promotion" />
        </div>
      </Card>
    </div>
  );
}
