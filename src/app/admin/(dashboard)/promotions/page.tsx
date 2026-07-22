import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Thumb } from "@/components/admin/Thumb";

export default async function PromotionsPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;
  const promotions = await prisma.promotion.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { startDate: "desc" },
    include: { venue: { select: { name: true } }, promotionCategory: { select: { name: true } } },
    })
  const total = await prisma.promotion.count({ where });

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <PageHeader title="Promotions" newHref="/admin/promotions/new" newLabel="New promotion" />
      <SearchInput placeholder="Search by name..." />
      <Card>
        <AdminTable
          rows={promotions}
          getKey={(p) => p.id}
          empty="No promotions yet."
          columns={[
            { header: "", cell: (p) => <Thumb src={p.image} alt={p.name} />, className: "w-12" },
            {
              header: "Name",
              cell: (p) => (
                <Link href={`/admin/promotions/${p.id}`} className="font-medium text-zinc-900 hover:underline">
                  {p.name}
                </Link>
              ),
            },
            { header: "Venue", cell: (p) => p.venue?.name ?? "—" },
            { header: "Category", cell: (p) => p.promotionCategory?.name ?? "—" },
            {
              header: "Runs",
              cell: (p) => (
                <span className="text-zinc-500">
                  {fmtDate(p.startDate)} – {fmtDate(p.endDate)}
                </span>
              ),
            },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
