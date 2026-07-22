"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const BASE = "/admin/promotion-categories";

export async function createPromotionCategoryAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  await prisma.promotionCategory.create({ data: { name } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updatePromotionCategoryAction(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  await prisma.promotionCategory.update({ where: { id }, data: { name } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function deletePromotionCategoryAction(id: string) {
  await prisma.promotionCategory.delete({ where: { id } });
  revalidatePath(BASE);
  redirect(BASE);
}
