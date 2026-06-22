"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileImageField, deleteUploadedFiles } from "@/lib/upload";

const BASE = "/admin/segment-galleries";
const CATEGORY = "segment-galleries";

function parse(formData: FormData) {
  const venueId = String(formData.get("venueId") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    venueId: venueId || null,
    special: formData.get("special") === "true",
  };
}

export async function createSegmentGalleryAction(formData: FormData) {
  const images = await reconcileImageField({ formData, field: "images", category: CATEGORY, previousPaths: [] });
  await prisma.segmentGallery.create({ data: { ...parse(formData), images } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateSegmentGalleryAction(id: string, formData: FormData) {
  const current = await prisma.segmentGallery.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const images = await reconcileImageField({ formData, field: "images", category: CATEGORY, previousPaths: current.images });
  await prisma.segmentGallery.update({ where: { id }, data: { ...parse(formData), images } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteSegmentGalleryAction(id: string) {
  const current = await prisma.segmentGallery.findUnique({ where: { id } });
  if (current) {
    await prisma.segmentGallery.delete({ where: { id } });
    await deleteUploadedFiles(current.images);
  }
  revalidatePath(BASE);
  redirect(BASE);
}
