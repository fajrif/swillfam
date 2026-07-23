"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { saveUploadedFile, PDF_MIME_TYPES, MAX_PDF_BYTES } from "@/lib/upload";

export type ApplicationActionState = {
  error?: string;
  success?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

export async function submitApplicationAction(
  _prevState: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  // Honeypot: real visitors never fill this hidden field. Pretend success, write nothing.
  if (String(formData.get("company_site") ?? "").trim()) {
    return { success: true };
  }

  const ip = await getClientIp();
  if (!checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return { error: "Too many submissions — please try again later." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const careerId = String(formData.get("careerId") ?? "").trim();
  const resume = formData.get("resume");

  if (!fullName || !email) {
    return { error: "Full name and email are required." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!(resume instanceof File) || resume.size === 0) {
    return { error: "Please attach your CV (PDF)." };
  }

  let resumeUrl: string;
  try {
    resumeUrl = await saveUploadedFile(resume, "applications", {
      allowedTypes: PDF_MIME_TYPES,
      maxBytes: MAX_PDF_BYTES,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not upload your CV." };
  }

  await prisma.application.create({
    data: { fullName, email, careerId: careerId || null, resumeUrl },
  });

  return { success: true };
}
