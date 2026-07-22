import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Thumb } from "@/components/admin/Thumb";

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const WEEKDAY_SHORT: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export default async function EventsPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;
  const events = await prisma.event.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { startDate: "desc" },
    include: { venue: { select: { name: true } }, eventCategory: { select: { name: true } } },
    })
  const total = await prisma.event.count({ where });

  return (
    <div>
      <PageHeader title="Events" newHref="/admin/events/new" newLabel="New event" />
      <SearchInput placeholder="Search by name..." />
      <Card>
        <AdminTable
          rows={events}
          getKey={(e) => e.id}
          empty="No events yet."
          columns={[
            { header: "", cell: (e) => <Thumb src={e.image} alt={e.name} />, className: "w-12" },
            {
              header: "Name",
              cell: (e) => (
                <Link href={`/admin/events/${e.id}`} className="font-medium text-zinc-900 hover:underline">
                  {e.name}
                </Link>
              ),
            },
            { header: "Venue", cell: (e) => e.venue?.name ?? "—" },
            { header: "Category", cell: (e) => e.eventCategory?.name ?? "—" },
            {
              header: "Schedule",
              cell: (e) =>
                e.eventType === "RECURRING" ? (
                  <span className="text-zinc-500">
                    Every {e.recurringDays.map((d) => WEEKDAY_SHORT[d] ?? d).join(", ") || "—"}
                  </span>
                ) : (
                  <span className="text-zinc-500">{fmtDate(e.startDate)}</span>
                ),
            },
            {
              header: "Flags",
              cell: (e) => (
                <span className="text-xs text-zinc-500">
                  {[e.featured ? "Featured" : null, e.isPrivate ? "Private" : null].filter(Boolean).join(", ") || "—"}
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
