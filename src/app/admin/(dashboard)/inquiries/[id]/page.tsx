import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InquiryForm } from "@/components/admin/InquiryForm";
import { updateInquiryAction } from "../actions";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Inquiry</h1>
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <InquiryForm inquiry={inquiry} action={updateInquiryAction.bind(null, id)} />
      </div>
    </div>
  );
}
