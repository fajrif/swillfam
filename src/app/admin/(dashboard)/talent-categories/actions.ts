"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const BASE = "/admin/talent-categories";

export async function createTalentCategoryAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  await prisma.talentCategory.create({ data: { name } });
  revalidatePath(BASE);
  revalidatePath("/talents");
  redirect(BASE);
}

export async function updateTalentCategoryAction(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  await prisma.talentCategory.update({ where: { id }, data: { name } });
  revalidatePath(BASE);
  revalidatePath("/talents");
  redirect(BASE);
}

export async function deleteTalentCategoryAction(id: string) {
  await prisma.talentCategory.delete({ where: { id } });
  revalidatePath(BASE);
  revalidatePath("/talents");
  redirect(BASE);
}
