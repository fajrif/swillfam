"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { EmploymentType } from "@/generated/prisma/client";

const BASE = "/admin/careers";

function parse(formData: FormData) {
  return {
    jobTitle: String(formData.get("jobTitle") ?? "").trim(),
    department: String(formData.get("department") ?? "").trim(),
    employmentType: String(formData.get("employmentType")) as EmploymentType,
    location: String(formData.get("location") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };
}

export async function createCareerAction(formData: FormData) {
  await prisma.career.create({ data: parse(formData) });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateCareerAction(id: string, formData: FormData) {
  await prisma.career.update({ where: { id }, data: parse(formData) });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  redirect(BASE);
}

export async function deleteCareerAction(id: string) {
  // Applications reference careerId with onDelete: SetNull — they survive the delete.
  await prisma.career.delete({ where: { id } });
  revalidatePath(BASE);
  redirect(BASE);
}
