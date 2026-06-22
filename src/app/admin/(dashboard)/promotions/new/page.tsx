import { prisma } from "@/lib/prisma";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPromotionAction } from "../actions";

export default async function NewPromotionPage() {
  const venues = await prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <EditHeader title="New Promotion" backHref="/admin/promotions" />
      <Card>
        <PromotionForm action={createPromotionAction} venues={venues} />
      </Card>
    </div>
  );
}
