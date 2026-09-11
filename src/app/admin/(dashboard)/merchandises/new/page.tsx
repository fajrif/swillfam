import { MerchandiseForm } from "@/components/admin/MerchandiseForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createMerchandiseAction } from "../actions";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function NewMerchandisePage() {
  await requireAdministrator();
  return (
    <div>
      <EditHeader title="New Merchandise" backHref="/admin/merchandises" />
      <Card>
        <MerchandiseForm action={createMerchandiseAction} />
      </Card>
    </div>
  );
}
