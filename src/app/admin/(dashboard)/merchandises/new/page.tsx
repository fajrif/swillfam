import { MerchandiseForm } from "@/components/admin/MerchandiseForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createMerchandiseAction } from "../actions";

export default function NewMerchandisePage() {
  return (
    <div>
      <EditHeader title="New Merchandise" backHref="/admin/merchandises" />
      <Card>
        <MerchandiseForm action={createMerchandiseAction} />
      </Card>
    </div>
  );
}
