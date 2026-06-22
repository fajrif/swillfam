"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";

const BASE = "/admin/videos";
const CATEGORY = "videos";

function parse(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    videoUrl: String(formData.get("videoUrl") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };
}

export async function createVideoAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  await prisma.video.create({ data: { ...parse(formData), image } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateVideoAction(id: string, formData: FormData) {
  const current = await prisma.video.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  await prisma.video.update({ where: { id }, data: { ...parse(formData), image } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteVideoAction(id: string) {
  const current = await prisma.video.findUnique({ where: { id } });
  if (current) {
    await prisma.video.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
