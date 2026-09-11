import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isSessionRevoked, signSession, verifySession } from "@/lib/auth";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/session";

/**
 * Admin data-access layer: every admin page and Server Action authorizes
 * through these helpers. `proxy.ts` only gates page routes — Server Actions are
 * separate entry points, so each one must call a guard itself.
 */

const loadAdmin = (id: string) =>
  prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      position: true,
      avatar: true,
      role: true,
      passwordChangedAt: true,
      venue: { select: { id: true, name: true, slug: true } },
    },
  });

export type CurrentAdmin = NonNullable<Awaited<ReturnType<typeof loadAdmin>>>;

/** The signed-in admin, re-read from the DB so role/venue edits and deletions apply immediately. */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;
  if (!session) return null;
  const admin = await loadAdmin(session.sub);
  if (!admin || isSessionRevoked(session.iat, admin.passwordChangedAt)) return null;
  return admin;
});

/** Issue a fresh session cookie — on login, and to keep the current tab signed in after a password change. */
export async function setSessionCookie(user: { id: string; email: string }) {
  const token = await signSession({ sub: user.id, email: user.email });
  (await cookies()).set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
}

export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireAdministrator(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (admin.role !== "ADMINISTRATOR") redirect("/admin");
  return admin;
}

export function isAdministrator(admin: CurrentAdmin) {
  return admin.role === "ADMINISTRATOR";
}

/** An operator's venue. Operators without one (e.g. it was deleted) are sent to their profile. */
export function operatorVenue(admin: CurrentAdmin) {
  if (!admin.venue) redirect("/admin/profile");
  return admin.venue;
}

/** The venue an operator's forms are locked to; undefined for administrators (free choice). */
export function lockedVenue(admin: CurrentAdmin) {
  return isAdministrator(admin) ? undefined : operatorVenue(admin);
}

/** List filter: nothing for administrators, pinned to their own venue for operators. */
export function venueWhere(admin: CurrentAdmin): { venueId?: string } {
  return isAdministrator(admin) ? {} : { venueId: operatorVenue(admin).id };
}

/** 404s when an operator reaches a row belonging to another venue. */
export function assertVenueOwnership(admin: CurrentAdmin, venueId: string | null) {
  if (isAdministrator(admin)) return;
  if (venueId !== operatorVenue(admin).id) notFound();
}

/** The venue a write should use: whatever was posted for administrators, always their own for operators. */
export function resolveVenueId(admin: CurrentAdmin, postedVenueId: string | null) {
  return isAdministrator(admin) ? postedVenueId : operatorVenue(admin).id;
}

/**
 * FAQs have no venue FK — a venue's FAQs are `segment: "venue"` + `refSlug: <venue slug>`.
 * Nothing for administrators; operators are pinned to their own venue's FAQs.
 * Doubles as the list filter and the forced values on write.
 */
export function venueFaqWhere(admin: CurrentAdmin): { segment?: string; refSlug?: string } {
  return isAdministrator(admin) ? {} : { segment: "venue", refSlug: operatorVenue(admin).slug };
}

/** 404s when an operator reaches an FAQ that isn't on their own venue page. */
export function assertFaqOwnership(admin: CurrentAdmin, faq: { segment: string; refSlug: string | null }) {
  if (isAdministrator(admin)) return;
  if (faq.segment !== "venue" || faq.refSlug !== operatorVenue(admin).slug) notFound();
}
