import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/EventForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateEventAction, deleteEventAction } from "../actions";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, venues, categories, talents] = await Promise.all([
    prisma.event.findUnique({ where: { id }, include: { talents: { select: { id: true } } } }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.eventCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.talent.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!event) notFound();

  return (
    <div>
      <EditHeader title="Edit Event" backHref="/admin/events" />
      <Card>
        <EventForm
          action={updateEventAction.bind(null, id)}
          event={event}
          venues={venues}
          categories={categories}
          talents={talents}
          selectedTalentIds={event.talents.map((t) => t.id)}
        />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteEventAction.bind(null, id)} label="Delete event" />
        </div>
      </Card>
    </div>
  );
}
