import { CareerForm } from "@/components/admin/CareerForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createCareerAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewCareerPage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Career" backHref="/admin/careers" />
      <Card>
        <CareerForm action={createCareerAction} />
      </Card>
    </div>
  );
}
