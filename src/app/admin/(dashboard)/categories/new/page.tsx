import { CategoryForm } from "@/components/admin/CategoryForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createCategoryAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewCategoryPage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Venue Category" backHref="/admin/categories" />
      <Card>
        <CategoryForm action={createCategoryAction} />
      </Card>
    </div>
  );
}
