import { prisma } from "@/lib/prisma";
import { requireAdmin, lockedVenue } from "@/lib/admin-auth";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPromotionAction } from "../actions";

export default async function NewPromotionPage() {
  const admin = await requireAdmin();
  const [venues, categories] = await Promise.all([
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.promotionCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <EditHeader title="New Promotion" backHref="/admin/promotions" />
      <Card>
        <PromotionForm
          action={createPromotionAction}
          venues={venues}
          categories={categories}
          operatorVenue={lockedVenue(admin)}
        />
      </Card>
    </div>
  );
}
