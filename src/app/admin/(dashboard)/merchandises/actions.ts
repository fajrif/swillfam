"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";

const BASE = "/admin/merchandises";
const CATEGORY = "merchandises";

function parse(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    price: String(formData.get("price") ?? "0").trim() || "0",
  };
}

export async function createMerchandiseAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  await prisma.merchandise.create({ data: { ...parse(formData), image } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateMerchandiseAction(id: string, formData: FormData) {
  const current = await prisma.merchandise.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  await prisma.merchandise.update({ where: { id }, data: { ...parse(formData), image } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteMerchandiseAction(id: string) {
  const current = await prisma.merchandise.findUnique({ where: { id } });
  if (current) {
    await prisma.merchandise.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
