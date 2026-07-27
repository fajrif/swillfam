import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";

export default async function PrivateEventTestimonialsPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { author: { contains: search, mode: "insensitive" as const } } : undefined;
  const [testimonials, total] = await Promise.all([
    prisma.privateEventTestimonial.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { privateEvent: { select: { title: true } } },
    }),
    prisma.privateEventTestimonial.count({ where }),
  ]);

  return (
    <div>
      <PageHeader
        title="Private Event Testimonials"
        newHref="/admin/private-event-testimonials/new"
        newLabel="New testimonial"
      />
      <SearchInput placeholder="Search by author..." />
      <Card>
        <AdminTable
          rows={testimonials}
          getKey={(t) => t.id}
          empty="No testimonials yet."
          columns={[
            {
              header: "Author",
              cell: (t) => (
                <>
                  <Link
                    href={`/admin/private-event-testimonials/${t.id}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {t.author}
                  </Link>
                  <div className="line-clamp-1 text-xs text-zinc-400">{t.quote}</div>
                </>
              ),
            },
            { header: "Private event", cell: (t) => t.privateEvent?.title ?? "—" },
            { header: "Status", cell: (t) => (t.published ? "Published" : "Draft") },
            { header: "Order", cell: (t) => t.sortOrder },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
