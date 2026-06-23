"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const BASE = "/admin/faqs";

function parse(formData: FormData) {
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    segment: String(formData.get("segment") ?? "general").trim(),
    sortOrder: Number.parseInt(formData.get("sortOrder") as string, 10) || 0,
    published: formData.get("published") === "true",
  };
}

export async function createFaqAction(formData: FormData) {
  await prisma.faq.create({ data: parse(formData) });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateFaqAction(id: string, formData: FormData) {
  await prisma.faq.update({ where: { id }, data: parse(formData) });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteFaqAction(id: string) {
  await prisma.faq.delete({ where: { id } });
  revalidatePath(BASE);
  redirect(BASE);
}
