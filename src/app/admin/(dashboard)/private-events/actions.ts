"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  reconcileImageField,
  reconcileSingleImage,
  deleteUploadedFiles,
  collectImagePaths,
} from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";

const BASE = "/admin/private-events";
const CATEGORY = "private-events";

function parse(formData: FormData) {
  const privateEventTypeId = String(formData.get("privateEventTypeId") ?? "").trim();
  const optional = (name: string) => String(formData.get(name) ?? "").trim() || null;

  return {
    title: String(formData.get("title") ?? "").trim(),
    heroTitle: optional("heroTitle"),
    caption: String(formData.get("caption") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    privateEventTypeId: privateEventTypeId || null,
    occasionsTitle: optional("occasionsTitle"),
    testimonialsTitle: optional("testimonialsTitle"),
    testimonialsLead: optional("testimonialsLead"),
    venuesTitle: optional("venuesTitle"),
    galleryTitle: optional("galleryTitle"),
    galleryLead: optional("galleryLead"),
    sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
    published: formData.get("published") === "true",
  };
}

/** The venue checkbox group posts one `venueIds` entry per ticked box. */
function venueIds(formData: FormData) {
  return formData.getAll("venueIds").map((id) => ({ id: String(id) }));
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("title") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.privateEvent.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

function revalidatePublic(slug?: string) {
  revalidatePath("/private-events");
  if (slug) revalidatePath(`/private-events/${slug}`);
}

export async function createPrivateEventAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: null });
  const galleries = await reconcileImageField({
    formData,
    field: "galleries",
    category: CATEGORY,
    previousPaths: [],
  });
  const slug = await uniqueSlug(formData);
  await prisma.privateEvent.create({
    data: {
      ...parse(formData),
      slug,
      image,
      bannerImage,
      galleries,
      venues: { connect: venueIds(formData) },
    },
  });
  revalidatePath(BASE);
  revalidatePublic(slug);
  redirect(BASE);
}

export async function updatePrivateEventAction(id: string, formData: FormData) {
  const current = await prisma.privateEvent.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const bannerImage = await reconcileSingleImage({ formData, field: "bannerImage", category: CATEGORY, previousPath: current.bannerImage });
  const galleries = await reconcileImageField({
    formData,
    field: "galleries",
    category: CATEGORY,
    previousPaths: current.galleries,
  });
  const slug = await uniqueSlug(formData, id);
  await prisma.privateEvent.update({
    where: { id },
    data: {
      ...parse(formData),
      slug,
      image,
      bannerImage,
      galleries,
      // `set` replaces the whole selection, so unticking a box unlinks it.
      venues: { set: venueIds(formData) },
    },
  });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  revalidatePublic(slug);
  if (current.slug !== slug) revalidatePublic(current.slug);
  redirect(BASE);
}

export async function deletePrivateEventAction(id: string) {
  const current = await prisma.privateEvent.findUnique({
    where: { id },
    include: { occasions: { select: { image: true } } },
  });
  if (current) {
    // Child FKs are `SetNull` per the repo convention, so they'd survive as
    // orphans — drop them (and their uploads) explicitly instead.
    const occasionImages = current.occasions.map((o) => o.image);
    await prisma.privateEventOccasion.deleteMany({ where: { privateEventId: id } });
    await prisma.privateEventTestimonial.deleteMany({ where: { privateEventId: id } });
    await prisma.privateEvent.delete({ where: { id } });
    await deleteUploadedFiles(
      collectImagePaths(current.image, current.bannerImage, current.galleries, ...occasionImages),
    );
  }
  revalidatePath(BASE);
  revalidatePublic(current?.slug);
  redirect(BASE);
}
