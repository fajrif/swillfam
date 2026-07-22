"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";

const BASE = "/admin/talents";
const CATEGORY = "talents";

function parse(formData: FormData) {
  const venueId = String(formData.get("venueId") ?? "").trim();
  const talentCategoryId = String(formData.get("talentCategoryId") ?? "").trim();
  return {
    name: String(formData.get("name") ?? "").trim(),
    speciality: String(formData.get("speciality") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    venueId: venueId || null,
    talentCategoryId: talentCategoryId || null,
    instagramUrl: String(formData.get("instagramUrl") ?? "").trim() || null,
    spotifyEmbed: String(formData.get("spotifyEmbed") ?? "").trim() || null,
    youtubeEmbed: String(formData.get("youtubeEmbed") ?? "").trim() || null,
    instagramEmbed: String(formData.get("instagramEmbed") ?? "").trim() || null,
  };
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("name") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.talent.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

export async function createTalentAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const slug = await uniqueSlug(formData);
  await prisma.talent.create({ data: { ...parse(formData), slug, image } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateTalentAction(id: string, formData: FormData) {
  const current = await prisma.talent.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const slug = await uniqueSlug(formData, id);
  await prisma.talent.update({ where: { id }, data: { ...parse(formData), slug, image } });
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
