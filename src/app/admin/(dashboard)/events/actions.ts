"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, reconcileImageField, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";
import {
  requireAdmin,
  assertVenueOwnership,
  isAdministrator,
  resolveVenueId,
  type CurrentAdmin,
} from "@/lib/admin-auth";
import type { EventSchemaType, EventStatus, EventType, Weekday } from "@/generated/prisma/client";
import { EVENT_SCHEMA_TYPES, EVENT_STATUSES, allowedValues } from "@/lib/schema-options";
import { toIsoDuration } from "@/lib/duration";

const BASE = "/admin/events";
const CATEGORY = "events";

function parse(formData: FormData, admin: CurrentAdmin, currentFeatured = false) {
  const eventCategoryId = String(formData.get("eventCategoryId") ?? "").trim();
  const venueId = String(formData.get("venueId") ?? "").trim();
  const endDateRaw = String(formData.get("endDate") ?? "").trim();
  const eventType = String(formData.get("eventType") ?? "FIXED") as EventType;
  const recurringDays = formData.getAll("recurringDays").map(String) as Weekday[];
  // Fall back to the enum defaults rather than trusting the posted string: an
  // unrecognised value would be a Postgres error mid-save.
  const [schemaEventType = "Event"] = allowedValues(EVENT_SCHEMA_TYPES, [
    String(formData.get("schemaEventType") ?? ""),
  ]);
  const [eventStatus = "EventScheduled"] = allowedValues(EVENT_STATUSES, [
    String(formData.get("eventStatus") ?? ""),
  ]);
  return {
    name: String(formData.get("name") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim(),
    eventCategoryId: eventCategoryId || null,
    // Operators are pinned to their own venue, whatever was posted.
    venueId: resolveVenueId(admin, venueId || null),
    eventType,
    startDate: new Date(String(formData.get("startDate"))),
    endDate: endDateRaw ? new Date(endDateRaw) : null,
    startHour: String(formData.get("startHour") ?? "").trim(),
    endHour: String(formData.get("endHour") ?? "").trim(),
    recurringDays: eventType === "RECURRING" ? recurringDays : [],
    nextEditionDescription:
      eventType === "RECURRING"
        ? String(formData.get("nextEditionDescription") ?? "").trim() || null
        : null,
    // Featured drives site-wide slots (home, the /events hero), so only administrators set it.
    featured: isAdministrator(admin) ? formData.get("featured") === "true" : currentFeatured,
    active: formData.get("active") === "true",
    schemaEventType: schemaEventType as EventSchemaType,
    eventStatus: eventStatus as EventStatus,
    ticketInfo: String(formData.get("ticketInfo") ?? "").trim() || null,
    waPhone: String(formData.get("waPhone") ?? "").trim() || null,
    ticketLink: String(formData.get("ticketLink") ?? "").trim() || null,
    recapVideoUrl: String(formData.get("recapVideoUrl") ?? "").trim() || null,
    // Normalised to an ISO 8601 duration on the way in, so the column always
    // holds what VideoObject requires whichever form was typed.
    recapDuration: toIsoDuration(String(formData.get("recapDuration") ?? "")) || null,
    metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
    metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
  };
}

/** The talent checkbox group posts one `talentIds` entry per ticked box. */
function talentIds(formData: FormData) {
  return formData.getAll("talentIds").map((id) => ({ id: String(id) }));
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("name") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.event.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

export async function createEventAction(formData: FormData) {
  const admin = await requireAdmin();
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: null });
  const posterImage = await reconcileSingleImage({ formData, field: "posterImage", category: CATEGORY, previousPath: null });
  const galleries = await reconcileImageField({ formData, field: "galleries", category: CATEGORY, previousPaths: [] });
  const recapThumbnail = await reconcileSingleImage({ formData, field: "recapThumbnail", category: CATEGORY, previousPath: null });
  const slug = await uniqueSlug(formData);
  const ogImage = await reconcileSingleImage({ formData, field: "ogImage", category: CATEGORY, previousPath: null });
  await prisma.event.create({
    data: {
      ogImage,
      ...parse(formData, admin),
      slug,
      image,
      bannerImage,
      posterImage,
      recapThumbnail,
      galleries,
      talents: { connect: talentIds(formData) },
    },
  });
  revalidatePath(BASE);
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  redirect(BASE);
}

export async function updateEventAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const current = await prisma.event.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  // Before any upload/unlink below.
  assertVenueOwnership(admin, current.venueId);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: current.bannerImage });
  const posterImage = await reconcileSingleImage({ formData, field: "posterImage", category: CATEGORY, previousPath: current.posterImage });
  const galleries = await reconcileImageField({ formData, field: "galleries", category: CATEGORY, previousPaths: current.galleries });
  const recapThumbnail = await reconcileSingleImage({ formData, field: "recapThumbnail", category: CATEGORY, previousPath: current.recapThumbnail });
  const slug = await uniqueSlug(formData, id);
  const ogImage = await reconcileSingleImage({ formData, field: "ogImage", category: CATEGORY, previousPath: current.ogImage });
  await prisma.event.update({
    where: { id },
    data: {
      ogImage,
      ...parse(formData, admin, current.featured),
      slug,
      image,
      bannerImage,
      posterImage,
      recapThumbnail,
      galleries,
      // `set` replaces the whole selection, so unticking a box unlinks it.
      talents: { set: talentIds(formData) },
    },
  });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  redirect(BASE);
}

export async function deleteEventAction(id: string) {
  const admin = await requireAdmin();
  const current = await prisma.event.findUnique({ where: { id } });
  if (current) {
    assertVenueOwnership(admin, current.venueId);
    await prisma.event.delete({ where: { id } });
    await deleteUploadedFiles(
      collectImagePaths(
        current.image,
        current.bannerImage,
        current.posterImage,
        current.recapThumbnail,
        current.galleries,
        current.ogImage,
      ),
    );
    revalidatePath("/events");
    revalidatePath(`/events/${current.slug}`);
  }
  revalidatePath(BASE);
  redirect(BASE);
}
