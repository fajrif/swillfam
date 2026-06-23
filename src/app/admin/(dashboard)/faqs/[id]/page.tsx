import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FaqForm } from "@/components/admin/FaqForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateFaqAction, deleteFaqAction } from "../actions";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div>
      <EditHeader title="Edit FAQ" backHref="/admin/faqs" />
      <Card>
        <FaqForm action={updateFaqAction.bind(null, id)} faq={faq} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteFaqAction.bind(null, id)} label="Delete FAQ" />
        </div>
      </Card>
    </div>
  );
}
