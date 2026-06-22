import { CategoryForm } from "@/components/admin/CategoryForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createCategoryAction } from "../actions";

export default function NewCategoryPage() {
  return (
    <div>
      <EditHeader title="New Venue Category" backHref="/admin/categories" />
      <Card>
        <CategoryForm action={createCategoryAction} />
      </Card>
    </div>
  );
}
