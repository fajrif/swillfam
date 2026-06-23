import { FaqForm } from "@/components/admin/FaqForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createFaqAction } from "../actions";

export default function NewFaqPage() {
  return (
    <div>
      <EditHeader title="New FAQ" backHref="/admin/faqs" />
      <Card>
        <FaqForm action={createFaqAction} />
      </Card>
    </div>
  );
}
