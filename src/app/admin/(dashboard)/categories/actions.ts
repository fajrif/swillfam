"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";

const BASE = "/admin/categories";
const CATEGORY = "categories";

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("name") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.category.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

export async function createCategoryAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: null });
  const slug = await uniqueSlug(formData);
  await prisma.category.create({
    data: {
      name: String(formData.get("name") ?? "").trim(),
      caption: String(formData.get("caption") ?? "").trim(),
      headline: String(formData.get("headline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      shortDescription: String(formData.get("shortDescription") ?? "").trim() || null,
      slug,
      image,
      bannerImage,
    },
  });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: current.bannerImage });
  const slug = await uniqueSlug(formData, id);
  await prisma.category.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      caption: String(formData.get("caption") ?? "").trim(),
      headline: String(formData.get("headline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      shortDescription: String(formData.get("shortDescription") ?? "").trim() || null,
      slug,
      image,
      bannerImage,
    },
  });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteCategoryAction(id: string) {
  const current = await prisma.category.findUnique({ where: { id } });
  if (current) {
    // Venues reference categoryId with onDelete: SetNull — they survive.
    await prisma.category.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image, current.bannerImage));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
