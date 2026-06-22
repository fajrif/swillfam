"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";
import { ensureUniqueSlug } from "@/lib/slug";

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
  };
}

async function uniqueSlug(formData: FormData, excludeId?: string) {
  const base = String(formData.get("slug") ?? "").trim() || String(formData.get("title") ?? "").trim();
  return ensureUniqueSlug(base, async (s) => {
    const found = await prisma.article.findUnique({ where: { slug: s }, select: { id: true } });
    return !!found && found.id !== excludeId;
  });
}

export async function createArticleAction(formData: FormData) {
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: null });
  const slug = await uniqueSlug(formData);
  await prisma.article.create({ data: { ...parse(formData), slug, image } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateArticleAction(id: string, formData: FormData) {
  const current = await prisma.article.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const image = await reconcileSingleImage({ formData, field: "image", category: CATEGORY, previousPath: current.image });
  const slug = await uniqueSlug(formData, id);
  await prisma.article.update({ where: { id }, data: { ...parse(formData), slug, image } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteArticleAction(id: string) {
  const current = await prisma.article.findUnique({ where: { id } });
  if (current) {
    await prisma.article.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.image));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
