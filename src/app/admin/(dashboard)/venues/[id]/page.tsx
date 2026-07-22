import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VenueForm } from "@/components/admin/VenueForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { Thumb } from "@/components/admin/Thumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { updateVenueAction, deleteVenueAction } from "../actions";

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

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [venue, categories] = await Promise.all([
    prisma.venue.findUnique({
      where: { id },
      include: {
        events: {
          include: { eventCategory: { select: { name: true } } },
          orderBy: { startDate: "desc" },
        },
        promotions: {
          include: { promotionCategory: { select: { name: true } } },
          orderBy: { startDate: "desc" },
        },
        talents: {
          include: { talentCategory: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!venue) notFound();

  return (
    <div>
      <EditHeader title="Edit Venue" backHref="/admin/venues" />
      <Card>
        <VenueForm action={updateVenueAction.bind(null, id)} venue={venue} categories={categories} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteVenueAction.bind(null, id)} label="Delete venue" />
        </div>
      </Card>

      <div className="mt-6">
        <Card>
          <Tabs defaultValue="events">
            <TabsList>
              <TabsTrigger value="events">Events ({venue.events.length})</TabsTrigger>
              <TabsTrigger value="promotions">Promotions ({venue.promotions.length})</TabsTrigger>
              <TabsTrigger value="talents">Talents ({venue.talents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <AdminTable
                rows={venue.events}
                getKey={(e) => e.id}
                empty="No events for this venue yet."
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
            </TabsContent>

            <TabsContent value="promotions">
              <AdminTable
                rows={venue.promotions}
                getKey={(p) => p.id}
                empty="No promotions for this venue yet."
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
            </TabsContent>

            <TabsContent value="talents">
              <AdminTable
                rows={venue.talents}
                getKey={(t) => t.id}
                empty="No talents for this venue yet."
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
                  { header: "Category", cell: (t) => t.talentCategory?.name ?? "—" },
                ]}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
