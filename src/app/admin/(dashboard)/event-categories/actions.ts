"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdministrator } from "@/lib/admin-auth";

const BASE = "/admin/event-categories";

export async function createEventCategoryAction(formData: FormData) {
  await requireAdministrator();
  const name = String(formData.get("name") ?? "").trim();
  await prisma.eventCategory.create({ data: { name } });
  revalidatePath(BASE);
  revalidatePath("/events");
  redirect(BASE);
}

export async function updateEventCategoryAction(id: string, formData: FormData) {
  await requireAdministrator();
  const name = String(formData.get("name") ?? "").trim();
  await prisma.eventCategory.update({ where: { id }, data: { name } });
  revalidatePath(BASE);
  revalidatePath("/events");
  redirect(BASE);
}

export async function deleteEventCategoryAction(id: string) {
  await requireAdministrator();
  await prisma.eventCategory.delete({ where: { id } });
  revalidatePath(BASE);
  revalidatePath("/events");
  redirect(BASE);
}
