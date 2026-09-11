import { requireAdmin, lockedVenue } from "@/lib/admin-auth";
import { FaqForm } from "@/components/admin/FaqForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createFaqAction } from "../actions";

export default async function NewFaqPage() {
  const admin = await requireAdmin();

  return (
    <div>
      <EditHeader title="New FAQ" backHref="/admin/faqs" />
      <Card>
        <FaqForm action={createFaqAction} operatorVenue={lockedVenue(admin)} />
      </Card>
    </div>
  );
}
