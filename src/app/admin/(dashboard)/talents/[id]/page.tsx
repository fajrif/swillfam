import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TalentForm } from "@/components/admin/TalentForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateTalentAction, deleteTalentAction } from "../actions";

export default async function EditTalentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [talent, venues] = await Promise.all([
    prisma.talent.findUnique({ where: { id } }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!talent) notFound();

  return (
    <div>
      <EditHeader title="Edit Talent" backHref="/admin/talents" />
      <Card>
        <TalentForm action={updateTalentAction.bind(null, id)} talent={talent} venues={venues} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteTalentAction.bind(null, id)} label="Delete talent" />
        </div>
      </Card>
    </div>
  );
}
