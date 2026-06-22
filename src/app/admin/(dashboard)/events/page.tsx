import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Thumb } from "@/components/admin/Thumb";

const WEEKDAY_SHORT: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    include: { venue: { select: { name: true } }, eventCategory: { select: { name: true } } },
  });

  return (
    <div>
      <PageHeader title="Events" newHref="/admin/events/new" newLabel="New event" />
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
                <>
                  <Link href={`/admin/events/${e.id}`} className="font-medium text-zinc-900 hover:underline">
                    {e.name}
                  </Link>
                  <div className="text-xs text-zinc-400">
                    {[e.eventCategory?.name, e.venue?.name].filter(Boolean).join(" · ") || "—"}
                  </div>
                </>
              ),
            },
            {
              header: "Schedule",
              cell: (e) =>
                e.eventType === "RECURRING" ? (
                  <span className="text-zinc-500">
                    Every {e.recurringDays.map((d) => WEEKDAY_SHORT[d] ?? d).join(", ") || "—"}
                  </span>
                ) : (
                  <span className="text-zinc-500">{e.startDate.toLocaleDateString()}</span>
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
      </Card>
    </div>
  );
}
