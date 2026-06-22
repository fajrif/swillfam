"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const BASE = "/admin/event-categories";

export async function createEventCategoryAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  await prisma.eventCategory.create({ data: { name } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateEventCategoryAction(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  await prisma.eventCategory.update({ where: { id }, data: { name } });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteEventCategoryAction(id: string) {
  await prisma.eventCategory.delete({ where: { id } });
  revalidatePath(BASE);
  redirect(BASE);
}
