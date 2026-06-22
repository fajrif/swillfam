"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";

const BASE = "/admin/talents";
const CATEGORY = "talents";

function parse(formData: FormData) {
  const venueId = String(formData.get("venueId") ?? "").trim();
  return {
    name: String(formData.get("name") ?? "").trim(),
    speciality: String(formData.get("speciality") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    venueId: venueId || null,
    instagramUrl: String(formData.get("instagramUrl") ?? "").trim() || null,
  };
}

export async function createTalentAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  await prisma.talent.create({ data: { ...parse(formData), image } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateTalentAction(id: string, formData: FormData) {
  const current = await prisma.talent.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  await prisma.talent.update({ where: { id }, data: { ...parse(formData), image } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteTalentAction(id: string) {
  const current = await prisma.talent.findUnique({ where: { id } });
  if (current) {
    await prisma.talent.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
