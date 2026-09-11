import type { AdminRole } from "@/generated/prisma/client";

/**
 * Display labels for admin roles. Kept apart from `admin-auth.ts` so client
 * components (Sidebar, forms) can import it without pulling in Prisma.
 */
export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  ADMINISTRATOR: "Administrator",
  OPERATOR: "Operator",
};

export const ADMIN_ROLE_OPTIONS = (Object.keys(ADMIN_ROLE_LABEL) as AdminRole[]).map((value) => ({
  value,
  label: ADMIN_ROLE_LABEL[value],
}));
