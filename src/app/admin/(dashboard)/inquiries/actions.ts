"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { InquiryStatus } from "@/generated/prisma/client";

export async function updateInquiryAction(id: string, formData: FormData) {
  const status = String(formData.get("status")) as InquiryStatus;
  await prisma.inquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  redirect("/admin/inquiries");
}

export async function deleteInquiryAction(id: string) {
  await prisma.inquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
  redirect("/admin/inquiries");
}
