import type { RenewalStatus } from "@/generated/prisma/client";

const DUE_SOON_WINDOW_DAYS = 30;

export type RenewalBadge = "ACTIVE" | "DUE_SOON" | "EXPIRED" | "CANCELLED";

export function computeRenewalBadge(contractEnd: Date, renewalStatus: RenewalStatus): RenewalBadge {
  if (renewalStatus === "CANCELLED") return "CANCELLED";

  const daysUntilEnd = (contractEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysUntilEnd < 0) return "EXPIRED";
  if (daysUntilEnd <= DUE_SOON_WINDOW_DAYS) return "DUE_SOON";
  return "ACTIVE";
}
