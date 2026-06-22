import { prisma } from "@/lib/prisma";
import { TalentForm } from "@/components/admin/TalentForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createTalentAction } from "../actions";

export default async function NewTalentPage() {
  const venues = await prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <EditHeader title="New Talent" backHref="/admin/talents" />
      <Card>
        <TalentForm action={createTalentAction} venues={venues} />
      </Card>
    </div>
  );
}
