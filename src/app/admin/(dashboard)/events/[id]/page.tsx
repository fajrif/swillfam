import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, assertVenueOwnership, lockedVenue } from "@/lib/admin-auth";
import { EventForm } from "@/components/admin/EventForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader } from "@/components/admin/PageHeader";
import { updateEventAction, deleteEventAction } from "../actions";
import { EditPageTabs } from "@/components/admin/EditPageTabs";
import { SeoDetailsPanel } from "@/components/admin/SeoDetailsPanel";
import { eventSeo } from "@/lib/seo/entities";
import { getImageAltRecord } from "@/lib/image-alt";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const altsByPath = await getImageAltRecord();
  const { id } = await params;
  const admin = await requireAdmin();
  const [event, venues, categories, talents] = await Promise.all([
    prisma.event.findUnique({
      where: { id },
      include: {
        talents: { select: { id: true } },
        // The venue is part of the event's resolved title, and its
        // published state decides whether this event has a public page.
        venue: { select: { name: true, published: true } },
      },
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.eventCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.talent.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, status: true } }),
  ]);
  if (!event) notFound();
  assertVenueOwnership(admin, event.venueId);

  return (
    <div>
      <EditHeader title="Edit Event" backHref="/admin/events" />
      <EditPageTabs
        details={
          <>
            <EventForm
              altsByPath={altsByPath}
              action={updateEventAction.bind(null, id)}
              event={event}
              venues={venues}
              categories={categories}
              talents={talents}
              selectedTalentIds={event.talents.map((t) => t.id)}
              operatorVenue={lockedVenue(admin)}
            />
            <div className="mt-6 pt-6 border-t border-zinc-200">
              <ConfirmDeleteButton action={deleteEventAction.bind(null, id)} label="Delete event" />
            </div>
          </>
        }
        seo={
          <>
            <SeoDetailsPanel
              seo={eventSeo(event)}
              publicPath={`/events/${event.slug}`}
              unavailableReason={
                event.venue && !event.venue.published
                  ? "This event's venue is unpublished, so the event has no public page yet."
                  : undefined
              }
            />
          </>
        }
      />
    </div>
  );
}
