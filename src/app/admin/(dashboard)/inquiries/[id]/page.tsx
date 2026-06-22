import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InquiryForm } from "@/components/admin/InquiryForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { updateInquiryAction, deleteInquiryAction } from "../actions";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Inquiry</h1>
        <Link href="/admin/inquiries" className="text-sm text-zinc-500 hover:text-zinc-900">
          ← Back
        </Link>
      </div>
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <InquiryForm inquiry={inquiry} action={updateInquiryAction.bind(null, id)} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteInquiryAction.bind(null, id)} label="Delete inquiry" />
        </div>
      </div>
    </div>
  );
}
