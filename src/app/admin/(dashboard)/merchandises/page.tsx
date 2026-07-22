import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Thumb } from "@/components/admin/Thumb";

export default async function MerchandisesPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const merchandises = await prisma.merchandise.findMany({
    where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Merchandises" newHref="/admin/merchandises/new" newLabel="New merchandise" />
      <SearchInput placeholder="Search by name..." />
      <Card>
        <AdminTable
          rows={merchandises}
          getKey={(m) => m.id}
          empty="No merchandise yet."
          columns={[
            { header: "", cell: (m) => <Thumb src={m.image} alt={m.name} />, className: "w-12" },
            {
              header: "Name",
              cell: (m) => (
                <Link href={`/admin/merchandises/${m.id}`} className="font-medium text-zinc-900 hover:underline">
                  {m.name}
                </Link>
              ),
            },
            { header: "Price", cell: (m) => m.price.toString() },
          ]}
        />
      </Card>
    </div>
  );
}
