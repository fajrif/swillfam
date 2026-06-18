"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { InquiryStatus, Package } from "@/generated/prisma/client";

export async function updateInquiryAction(id: string, formData: FormData) {
  const status = String(formData.get("status")) as InquiryStatus;
  const packageInterestRaw = String(formData.get("packageInterest") ?? "");
  const expectedUsersRaw = String(formData.get("expectedUsers") ?? "");

  await prisma.inquiry.update({
    where: { id },
    data: {
      status,
      packageInterest: packageInterestRaw ? (packageInterestRaw as Package) : null,
      expectedUsers: expectedUsersRaw ? Number.parseInt(expectedUsersRaw, 10) : null,
    },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  redirect("/admin/inquiries");
}
