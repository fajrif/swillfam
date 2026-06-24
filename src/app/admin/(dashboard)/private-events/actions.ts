"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";

const BASE = "/admin/private-events";
const CATEGORY = "private-events";

function parse(formData: FormData) {
  const privateEventTypeId = String(formData.get("privateEventTypeId") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    caption: String(formData.get("caption") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    privateEventTypeId: privateEventTypeId || null,
    sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
    published: formData.get("published") === "true",
  };
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("title") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.privateEvent.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

export async function createPrivateEventAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: null });
  const slug = await uniqueSlug(formData);
  await prisma.privateEvent.create({ data: { ...parse(formData), slug, image, bannerImage } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updatePrivateEventAction(id: string, formData: FormData) {
  const current = await prisma.privateEvent.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: current.bannerImage });
  const slug = await uniqueSlug(formData, id);
  await prisma.privateEvent.update({ where: { id }, data: { ...parse(formData), slug, image, bannerImage } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deletePrivateEventAction(id: string) {
  const current = await prisma.privateEvent.findUnique({ where: { id } });
  if (current) {
    await prisma.privateEvent.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image, current.bannerImage));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
