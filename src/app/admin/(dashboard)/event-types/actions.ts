"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";

const BASE = "/admin/event-types";
const CATEGORY = "event-types";

function parse(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
    published: formData.get("published") === "true",
  };
}

export async function createPrivateEventTypeAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  await prisma.privateEventType.create({ data: { ...parse(formData), image } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updatePrivateEventTypeAction(id: string, formData: FormData) {
  const current = await prisma.privateEventType.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  await prisma.privateEventType.update({ where: { id }, data: { ...parse(formData), image } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deletePrivateEventTypeAction(id: string) {
  const current = await prisma.privateEventType.findUnique({ where: { id } });
  if (current) {
    await prisma.privateEventType.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
