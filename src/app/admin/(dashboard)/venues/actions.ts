"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";
import { requireAdmin, requireAdministrator, assertVenueOwnership, isAdministrator } from "@/lib/admin-auth";
import { VENUE_SCHEMA_TYPES, allowedValues } from "@/lib/schema-options";
import { WEEKDAY_ORDER, parseHoursJson } from "@/lib/opening-hours";
import type { VenueSchemaType, Weekday } from "@/generated/prisma/client";

const BASE = "/admin/venues";
const CATEGORY = "venues";

/**
 * Nested-write payload: `sortOrder` is the order the admin arranged the rows in.
 *
 * The `satisfies` is a compile-time proof that `opening-hours.ts`'s day tokens
 * really are the Prisma enum's — it is Prisma-free by design, so without this a
 * typo there would surface only as a failed save. That established, the cast
 * below is sound.
 */
function hoursCreate(formData: FormData) {
  WEEKDAY_ORDER satisfies readonly Weekday[];
  return parseHoursJson(String(formData.get("hours") ?? "")).map((row, sortOrder) => ({
    ...row,
    days: row.days as Weekday[],
    sortOrder,
  }));
}

function parse(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();
  const schemaTypes = allowedValues(
    VENUE_SCHEMA_TYPES,
    formData.getAll("schemaTypes").map(String),
  ) as VenueSchemaType[];
  return {
    name: String(formData.get("name") ?? "").trim(),
    heroTitle: String(formData.get("heroTitle") ?? "").trim() || null,
    heroDescription: String(formData.get("heroDescription") ?? "").trim() || null,
    caption: String(formData.get("caption") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim(),
    talentSectionTitle: String(formData.get("talentSectionTitle") ?? "").trim() || null,
    talentSectionDescription: String(formData.get("talentSectionDescription") ?? "").trim() || null,
    categoryId: categoryId || null,
    operatingHours: String(formData.get("operatingHours") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    streetAddress: String(formData.get("streetAddress") ?? "").trim() || null,
    postalCode: String(formData.get("postalCode") ?? "").trim() || null,
    lat: latRaw ? Number.parseFloat(latRaw) : null,
    lng: lngRaw ? Number.parseFloat(lngRaw) : null,
    schemaTypes,
    cuisine: String(formData.get("cuisine") ?? "").trim() || null,
    instagramUrl: String(formData.get("instagramUrl") ?? "").trim() || null,
    spotifyEmbed: String(formData.get("spotifyEmbed") ?? "").trim() || null,
    youtubeEmbed: String(formData.get("youtubeEmbed") ?? "").trim() || null,
    instagramEmbed: String(formData.get("instagramEmbed") ?? "").trim() || null,
    whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    placeId: String(formData.get("placeId") ?? "").trim() || null,
    // Operators don't render this checkbox, so an unticked box and "no
    // permission" look identical here — `updateVenueAction` restores the
    // current value for them, the same way it does for `categoryId`.
    published: formData.get("published") === "true",
    metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
    metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
  };
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("name") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    // /venues/[slug] serves venues and venue categories from one segment, and a
    // category wins the dispatch — so a venue may not take a slug a category
    // already holds, or its page would be unreachable. Colliding slugs get the
    // usual -2 suffix rather than an error.
    const [venue, category] = await Promise.all([
      prisma.venue.findUnique({ where: { slug: s }, select: { id: true } }),
      prisma.category.findUnique({ where: { slug: s }, select: { id: true } }),
    ]);
    return !!category || (!!venue && venue.id !== excludeId);
  });
}

export async function createVenueAction(formData: FormData) {
  await requireAdministrator();
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: null });
  const logo = await reconcileSingleImage({ formData, field: "logo", category: CATEGORY, previousPath: null });
  const slug = await uniqueSlug(formData);
  const ogImage = await reconcileSingleImage({ formData, field: "ogImage", category: CATEGORY, previousPath: null });
  await prisma.venue.create({
    data: {
      ...parse(formData),
      slug,
      image,
      bannerImage,
      logo,
      ogImage,
      hours: { create: hoursCreate(formData) },
    },
  });
  revalidatePath(BASE);
  revalidatePath("/venues");
  revalidatePath(`/venues/${slug}`);
  redirect(BASE);
}

export async function updateVenueAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  assertVenueOwnership(admin, id);
  const current = await prisma.venue.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: current.bannerImage });
  const logo = await reconcileSingleImage({ formData, field: "logo", category: CATEGORY, previousPath: current.logo });
  const data = parse(formData);
  // Operators can't change the slug (venue FAQs are keyed by it), the category
  // taxonomy, or whether the venue is live.
  const slug = isAdministrator(admin) ? await uniqueSlug(formData, id) : current.slug;
  if (!isAdministrator(admin)) {
    data.categoryId = current.categoryId;
    data.published = current.published;
  }
  const ogImage = await reconcileSingleImage({ formData, field: "ogImage", category: CATEGORY, previousPath: current.ogImage });
  await prisma.venue.update({
    where: { id },
    data: {
      ...data,
      slug,
      image,
      bannerImage,
      logo,
      ogImage,
      // The editor posts the full set every time, so replacing the rows
      // wholesale is what keeps the saved order and the form's order the same.
      // Ids aren't round-tripped — nothing references an hours row.
      hours: { deleteMany: {}, create: hoursCreate(formData) },
    },
  });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  revalidatePath("/venues");
  revalidatePath(`/venues/${slug}`);
  // Back to the Venue Info page the edit was opened from.
  redirect(`${BASE}/${id}`);
}

export async function deleteVenueAction(id: string) {
  await requireAdministrator();
  const current = await prisma.venue.findUnique({ where: { id } });
  if (current) {
    // Segment galleries / talents / promotions / events / operator accounts reference
    // venueId with onDelete: SetNull, so they survive (their own images aren't touched here).
    // Hours rows are different: they're an owned detail, not an association, so
    // SetNull would leave unreachable rows behind. Cleared explicitly, the same
    // way the venue's uploaded files are below.
    await prisma.venueHour.deleteMany({ where: { venueId: id } });
    await prisma.venue.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image, current.bannerImage, current.logo, current.ogImage));
    revalidatePath("/venues");
    revalidatePath(`/venues/${current.slug}`);
  }
  revalidatePath(BASE);
  redirect(BASE);
}
