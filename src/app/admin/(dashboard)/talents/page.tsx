import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Thumb } from "@/components/admin/Thumb";

export default async function TalentsPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;
  const talents = await prisma.talent.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: { venue: { select: { name: true } }, talentCategory: { select: { name: true } } },
    })
  const total = await prisma.talent.count({ where });

  return (
    <div>
      <PageHeader title="Talents" newHref="/admin/talents/new" newLabel="New talent" />
      <SearchInput placeholder="Search by name..." />
      <Card>
        <AdminTable
          rows={talents}
          getKey={(t) => t.id}
          empty="No talents yet."
          columns={[
            { header: "", cell: (t) => <Thumb src={t.image} alt={t.name} />, className: "w-12" },
            {
              header: "Name",
              cell: (t) => (
                <>
                  <Link href={`/admin/talents/${t.id}`} className="font-medium text-zinc-900 hover:underline">
                    {t.name}
                  </Link>
                  <div className="text-xs text-zinc-400">{t.speciality}</div>
                </>
              ),
            },
            { header: "Venue", cell: (t) => t.venue?.name ?? "—" },
            { header: "Category", cell: (t) => t.talentCategory?.name ?? "—" },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
