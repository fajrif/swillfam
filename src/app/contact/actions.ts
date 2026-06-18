"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import type { Package } from "@/generated/prisma/client";

export type ContactActionState = {
  error?: string;
  success?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PACKAGES = ["BASIC", "PLUS", "BUSINESS"];
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

export async function submitInquiryAction(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // Honeypot: real visitors never fill this hidden field. Pretend success, write nothing.
  if (String(formData.get("company_site") ?? "").trim()) {
    return { success: true };
  }

  const ip = await getClientIp();
  if (!checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return { error: "Too many submissions — please try again later." };
  }

  const businessName = String(formData.get("businessName") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const packageInterest = String(formData.get("packageInterest") ?? "").trim();
  const expectedUsersRaw = String(formData.get("expectedUsers") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!businessName || !contactName || !email) {
    return { error: "Business name, contact name, and email are required." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!VALID_PACKAGES.includes(packageInterest)) {
    return { error: "Please select a package." };
  }
  const expectedUsers = Number.parseInt(expectedUsersRaw, 10);
  if (!Number.isInteger(expectedUsers) || expectedUsers < 1) {
    return { error: "Expected number of users must be at least 1." };
  }

  await prisma.inquiry.create({
    data: {
      businessName,
      contactName,
      email,
      phone: phone || null,
      packageInterest: packageInterest as Package,
      expectedUsers,
      message: message || null,
    },
  });

  return { success: true };
}
