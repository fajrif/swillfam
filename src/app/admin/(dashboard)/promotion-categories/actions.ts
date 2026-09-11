"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdministrator } from "@/lib/admin-auth";

const BASE = "/admin/promotion-categories";

export async function createPromotionCategoryAction(formData: FormData) {
  await requireAdministrator();
  const name = String(formData.get("name") ?? "").trim();
  await prisma.promotionCategory.create({ data: { name } });
  revalidatePath(BASE);
  revalidatePath("/promotions");
  redirect(BASE);
}

export async function updatePromotionCategoryAction(id: string, formData: FormData) {
  await requireAdministrator();
  const name = String(formData.get("name") ?? "").trim();
  await prisma.promotionCategory.update({ where: { id }, data: { name } });
  revalidatePath(BASE);
  revalidatePath("/promotions");
  redirect(BASE);
}

export async function deletePromotionCategoryAction(id: string) {
  await requireAdministrator();
  await prisma.promotionCategory.delete({ where: { id } });
  revalidatePath(BASE);
  revalidatePath("/promotions");
  redirect(BASE);
}
