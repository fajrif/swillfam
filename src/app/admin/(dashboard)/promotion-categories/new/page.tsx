import { NameForm } from "@/components/admin/NameForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPromotionCategoryAction } from "../actions";

export default function NewPromotionCategoryPage() {
  return (
    <div>
      <EditHeader title="New Promotion Category" backHref="/admin/promotion-categories" />
      <Card>
        <NameForm action={createPromotionCategoryAction} />
      </Card>
    </div>
  );
}
