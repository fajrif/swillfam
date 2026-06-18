import { prisma } from "@/lib/prisma";
import { InquiryTable } from "@/components/admin/InquiryTable";

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Inquiries</h1>
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <InquiryTable inquiries={inquiries} />
      </div>
    </div>
  );
}
