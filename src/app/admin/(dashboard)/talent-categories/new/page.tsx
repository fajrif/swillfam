import { NameForm } from "@/components/admin/NameForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createTalentCategoryAction } from "../actions";

export default function NewTalentCategoryPage() {
  return (
    <div>
      <EditHeader title="New Talent Category" backHref="/admin/talent-categories" />
      <Card>
        <NameForm action={createTalentCategoryAction} />
      </Card>
    </div>
  );
}
