"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";

const BASE = "/admin/venues";
const CATEGORY = "venues";

function parse(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    categoryId: categoryId || null,
    operatingHours: String(formData.get("operatingHours") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    lat: latRaw ? Number.parseFloat(latRaw) : null,
    lng: lngRaw ? Number.parseFloat(lngRaw) : null,
    spotifyEmbed: String(formData.get("spotifyEmbed") ?? "").trim() || null,
    youtubeEmbed: String(formData.get("youtubeEmbed") ?? "").trim() || null,
    instagramEmbed: String(formData.get("instagramEmbed") ?? "").trim() || null,
  };
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("name") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.venue.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

export async function createVenueAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: null });
  const logo = await reconcileSingleImage({ formData, field: "logo", category: CATEGORY, previousPath: null });
  const slug = await uniqueSlug(formData);
  await prisma.venue.create({ data: { ...parse(formData), slug, image, bannerImage, logo } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateVenueAction(id: string, formData: FormData) {
  const current = await prisma.venue.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: current.bannerImage });
  const logo = await reconcileSingleImage({ formData, field: "logo", category: CATEGORY, previousPath: current.logo });
  const slug = await uniqueSlug(formData, id);
  await prisma.venue.update({ where: { id }, data: { ...parse(formData), slug, image, bannerImage, logo } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteVenueAction(id: string) {
  const current = await prisma.venue.findUnique({ where: { id } });
  if (current) {
    // Segment galleries / talents / promotions / events reference venueId with
    // onDelete: SetNull, so they survive (their own images aren't touched here).
    await prisma.venue.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image, current.bannerImage, current.logo));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
