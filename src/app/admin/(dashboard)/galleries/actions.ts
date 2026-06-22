"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";

const BASE = "/admin/galleries";
const CATEGORY = "galleries";

function parse(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };
}

export async function createGalleryAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  await prisma.gallery.create({ data: { ...parse(formData), image } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateGalleryAction(id: string, formData: FormData) {
  const current = await prisma.gallery.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  await prisma.gallery.update({ where: { id }, data: { ...parse(formData), image } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteGalleryAction(id: string) {
  const current = await prisma.gallery.findUnique({ where: { id } });
  if (current) {
    await prisma.gallery.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
