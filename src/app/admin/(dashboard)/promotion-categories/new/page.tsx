import { NameForm } from "@/components/admin/NameForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPromotionCategoryAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewPromotionCategoryPage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Promotion Category" backHref="/admin/promotion-categories" />
      <Card>
        <NameForm action={createPromotionCategoryAction} />
      </Card>
    </div>
  );
}
