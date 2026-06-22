"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";

const BASE = "/admin/promotions";
const CATEGORY = "promotions";

function parse(formData: FormData) {
  const venueId = String(formData.get("venueId") ?? "").trim();
  return {
    name: String(formData.get("name") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim(),
    terms: String(formData.get("terms") ?? ""),
    venueId: venueId || null,
    startDate: new Date(String(formData.get("startDate"))),
    endDate: new Date(String(formData.get("endDate"))),
    startHour: String(formData.get("startHour") ?? "").trim(),
    endHour: String(formData.get("endHour") ?? "").trim(),
  };
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("name") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.promotion.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

export async function createPromotionAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: null });
  const posterImage = await reconcileSingleImage({ formData, field: "posterImage", category: CATEGORY, previousPath: null });
  const slug = await uniqueSlug(formData);
  await prisma.promotion.create({ data: { ...parse(formData), slug, image, bannerImage, posterImage } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updatePromotionAction(id: string, formData: FormData) {
  const current = await prisma.promotion.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: current.bannerImage });
  const posterImage = await reconcileSingleImage({ formData, field: "posterImage", category: CATEGORY, previousPath: current.posterImage });
  const slug = await uniqueSlug(formData, id);
  await prisma.promotion.update({ where: { id }, data: { ...parse(formData), slug, image, bannerImage, posterImage } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deletePromotionAction(id: string) {
  const current = await prisma.promotion.findUnique({ where: { id } });
  if (current) {
    await prisma.promotion.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image, current.bannerImage, current.posterImage));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
