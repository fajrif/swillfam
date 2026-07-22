import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";

export default async function FaqsPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const faqs = await prisma.faq.findMany({
    where: search ? { question: { contains: search, mode: "insensitive" } } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <PageHeader title="FAQs" newHref="/admin/faqs/new" newLabel="New FAQ" />
      <SearchInput placeholder="Search by question..." />
      <Card>
        <AdminTable
          rows={faqs}
          getKey={(f) => f.id}
          empty="No FAQs yet."
          columns={[
            {
              header: "Question",
              cell: (f) => (
                <Link href={`/admin/faqs/${f.id}`} className="font-medium text-zinc-900 hover:underline">
                  {f.question}
                </Link>
              ),
            },
            { header: "Segment", cell: (f) => f.segment },
            {
              header: "Status",
              cell: (f) => (f.published ? "Published" : "Draft"),
            },
            { header: "Order", cell: (f) => f.sortOrder },
          ]}
        />
      </Card>
    </div>
  );
}
