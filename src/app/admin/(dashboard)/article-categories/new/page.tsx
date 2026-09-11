import { NameForm } from "@/components/admin/NameForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createArticleCategoryAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewArticleCategoryPage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Article Category" backHref="/admin/article-categories" />
      <Card>
        <NameForm action={createArticleCategoryAction} />
      </Card>
    </div>
  );
}
