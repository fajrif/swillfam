import { CareerForm } from "@/components/admin/CareerForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createCareerAction } from "../actions";

export default function NewCareerPage() {
  return (
    <div>
      <EditHeader title="New Career" backHref="/admin/careers" />
      <Card>
        <CareerForm action={createCareerAction} />
      </Card>
    </div>
  );
}
