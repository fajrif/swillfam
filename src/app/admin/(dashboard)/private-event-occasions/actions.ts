"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";

const BASE = "/admin/private-event-occasions";
const CATEGORY = "private-event-occasions";

function parse(formData: FormData) {
  const privateEventId = String(formData.get("privateEventId") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    privateEventId: privateEventId || null,
    sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
    published: formData.get("published") === "true",
  };
}

/** The occasion only renders on its parent's detail page, so revalidate that. */
async function revalidateParent(privateEventId: string | null) {
  if (!privateEventId) return;
  const parent = await prisma.privateEvent.findUnique({
    where: { id: privateEventId },
    select: { slug: true },
  });
  if (parent) revalidatePath(`/private-events/${parent.slug}`);
}

export async function createPrivateEventOccasionAction(formData: FormData) {
  const data = parse(formData);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  await prisma.privateEventOccasion.create({ data: { ...data, image } });
  revalidatePath(BASE);
  await revalidateParent(data.privateEventId);
  redirect(BASE);
}

export async function updatePrivateEventOccasionAction(id: string, formData: FormData) {
  const current = await prisma.privateEventOccasion.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const data = parse(formData);
  const image = await reconcileSingleImage({
    formData,
    field: "image",
    category: CATEGORY,
    previousPath: current.image,
  });
  await prisma.privateEventOccasion.update({ where: { id }, data: { ...data, image } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  // Reparenting drops it off the old page as well as adding it to the new one.
  for (const parentId of new Set([current.privateEventId, data.privateEventId])) {
    await revalidateParent(parentId);
  }
  redirect(BASE);
}

export async function deletePrivateEventOccasionAction(id: string) {
  const current = await prisma.privateEventOccasion.findUnique({ where: { id } });
  if (current) {
    await prisma.privateEventOccasion.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image));
    await revalidateParent(current.privateEventId);
  }
  revalidatePath(BASE);
  redirect(BASE);
}
