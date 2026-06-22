"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, reconcileImageField, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";
import type { EventType, Weekday } from "@/generated/prisma/client";

const BASE = "/admin/events";
const CATEGORY = "events";

function parse(formData: FormData) {
  const eventCategoryId = String(formData.get("eventCategoryId") ?? "").trim();
  const venueId = String(formData.get("venueId") ?? "").trim();
  const endDateRaw = String(formData.get("endDate") ?? "").trim();
  const eventType = String(formData.get("eventType") ?? "FIXED") as EventType;
  const recurringDays = formData.getAll("recurringDays").map(String) as Weekday[];
  return {
    name: String(formData.get("name") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim(),
    eventCategoryId: eventCategoryId || null,
    venueId: venueId || null,
    eventType,
    startDate: new Date(String(formData.get("startDate"))),
    endDate: endDateRaw ? new Date(endDateRaw) : null,
    startHour: String(formData.get("startHour") ?? "").trim(),
    endHour: String(formData.get("endHour") ?? "").trim(),
    recurringDays: eventType === "RECURRING" ? recurringDays : [],
    featured: formData.get("featured") === "true",
    isPrivate: formData.get("isPrivate") === "true",
    ticketInfo: String(formData.get("ticketInfo") ?? "").trim() || null,
    waPhone: String(formData.get("waPhone") ?? "").trim() || null,
    ticketLink: String(formData.get("ticketLink") ?? "").trim() || null,
  };
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("name") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.event.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

export async function createEventAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: null });
  const posterImage = await reconcileSingleImage({ formData, field: "posterImage", category: CATEGORY, previousPath: null });
  const galleries = await reconcileImageField({ formData, field: "galleries", category: CATEGORY, previousPaths: [] });
  const slug = await uniqueSlug(formData);
  await prisma.event.create({ data: { ...parse(formData), slug, image, bannerImage, posterImage, galleries } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateEventAction(id: string, formData: FormData) {
  const current = await prisma.event.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: current.bannerImage });
  const posterImage = await reconcileSingleImage({ formData, field: "posterImage", category: CATEGORY, previousPath: current.posterImage });
  const galleries = await reconcileImageField({ formData, field: "galleries", category: CATEGORY, previousPaths: current.galleries });
  const slug = await uniqueSlug(formData, id);
  await prisma.event.update({ where: { id }, data: { ...parse(formData), slug, image, bannerImage, posterImage, galleries } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteEventAction(id: string) {
  const current = await prisma.event.findUnique({ where: { id } });
  if (current) {
    await prisma.event.delete({ where: { id } });
    await deleteUploadedFiles(
      collectImagePaths(current.image, current.bannerImage, current.posterImage, current.galleries),
    );
  }
  revalidatePath(BASE);
  redirect(BASE);
}
