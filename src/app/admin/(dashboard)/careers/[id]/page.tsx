import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CareerForm } from "@/components/admin/CareerForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateCareerAction, deleteCareerAction } from "../actions";

export default async function EditCareerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const career = await prisma.career.findUnique({ where: { id } });
  if (!career) notFound();

  return (
    <div>
      <EditHeader title="Edit Career" backHref="/admin/careers" />
      <Card>
        <CareerForm action={updateCareerAction.bind(null, id)} career={career} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteCareerAction.bind(null, id)} label="Delete career" />
        </div>
      </Card>
    </div>
  );
}
