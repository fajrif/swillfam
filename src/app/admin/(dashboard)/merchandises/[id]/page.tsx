import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MerchandiseForm } from "@/components/admin/MerchandiseForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateMerchandiseAction, deleteMerchandiseAction } from "../actions";

export default async function EditMerchandisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const merchandise = await prisma.merchandise.findUnique({ where: { id } });
  if (!merchandise) notFound();

  return (
    <div>
      <EditHeader title="Edit Merchandise" backHref="/admin/merchandises" />
      <Card>
        <MerchandiseForm action={updateMerchandiseAction.bind(null, id)} merchandise={merchandise} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteMerchandiseAction.bind(null, id)} label="Delete merchandise" />
        </div>
      </Card>
    </div>
  );
}
