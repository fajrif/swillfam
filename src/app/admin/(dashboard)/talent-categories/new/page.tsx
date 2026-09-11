import { NameForm } from "@/components/admin/NameForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createTalentCategoryAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewTalentCategoryPage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Talent Category" backHref="/admin/talent-categories" />
      <Card>
        <NameForm action={createTalentCategoryAction} />
      </Card>
    </div>
  );
}
