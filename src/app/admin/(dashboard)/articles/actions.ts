"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  reconcileSingleImage,
  deleteUploadedFiles,
  collectImagePaths,
  inlineImagePaths,
} from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";
import { requireAdministrator } from "@/lib/admin-auth";

const BASE = "/admin/articles";
const CATEGORY = "articles";

function parse(formData: FormData) {
  const categoryId = String(formData.get("articleCategoryId") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    articleCategoryId: categoryId || null,
    publishedDate: new Date(String(formData.get("publishedDate"))),
    status: Number.parseInt(String(formData.get("status") ?? "0"), 10) || 0,
    author: String(formData.get("author") ?? "").trim() || null,
    metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
    metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
  };
}

/** The "venues mentioned" multi-select posts one `venueIds` entry per pick. */
function venueIds(formData: FormData) {
  return formData.getAll("venueIds").map((id) => ({ id: String(id) }));
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("title") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.article.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

export async function createArticleAction(formData: FormData) {
  await requireAdministrator();
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const slug = await uniqueSlug(formData);
  const ogImage = await reconcileSingleImage({ formData, field: "ogImage", category: CATEGORY, previousPath: null });
  await prisma.article.create({
    data: { ...parse(formData), slug, image, ogImage, venues: { connect: venueIds(formData) } },
  });
  revalidatePath(BASE);
  revalidatePath("/guides");
  revalidatePath(`/guides/${slug}`);
  redirect(BASE);
}

export async function updateArticleAction(id: string, formData: FormData) {
  await requireAdministrator();
  const current = await prisma.article.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const slug = await uniqueSlug(formData, id);
  const ogImage = await reconcileSingleImage({ formData, field: "ogImage", category: CATEGORY, previousPath: current.ogImage });
  const data = parse(formData);
  // Pictures placed in the body live inside the HTML, so a removed one is found by
  // comparing the old and new text.
  const kept = new Set(inlineImagePaths(data.description));
  await deleteUploadedFiles(inlineImagePaths(current.description).filter((p) => !kept.has(p)));
  await prisma.article.update({
    where: { id },
    data: {
      ...data,
      slug,
      image,
      ogImage,
      // `set` replaces the whole selection, so removing a pill unlinks it.
      venues: { set: venueIds(formData) },
    },
  });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  revalidatePath("/guides");
  revalidatePath(`/guides/${slug}`);
  redirect(BASE);
}

export async function deleteArticleAction(id: string) {
  await requireAdministrator();
  const current = await prisma.article.findUnique({ where: { id } });
  if (current) {
    await prisma.article.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image, current.ogImage, inlineImagePaths(current.description)));
    revalidatePath("/guides");
    revalidatePath(`/guides/${current.slug}`);
  }
  revalidatePath(BASE);
  redirect(BASE);
}
