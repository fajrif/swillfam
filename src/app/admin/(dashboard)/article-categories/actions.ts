"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const BASE = "/admin/article-categories";

export async function createArticleCategoryAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  await prisma.articleCategory.create({ data: { name } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateArticleCategoryAction(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  await prisma.articleCategory.update({ where: { id }, data: { name } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteArticleCategoryAction(id: string) {
  await prisma.articleCategory.delete({ where: { id } });
  revalidatePath(BASE);
  redirect(BASE);
}
