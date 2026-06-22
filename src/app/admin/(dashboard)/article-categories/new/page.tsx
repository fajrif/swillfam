import { NameForm } from "@/components/admin/NameForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createArticleCategoryAction } from "../actions";

export default function NewArticleCategoryPage() {
  return (
    <div>
      <EditHeader title="New Article Category" backHref="/admin/article-categories" />
      <Card>
        <NameForm action={createArticleCategoryAction} />
      </Card>
    </div>
  );
}
