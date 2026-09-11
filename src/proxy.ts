import { NextResponse, type NextRequest } from "next/server";
import { isSessionRevoked, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/session";

/** Sections an operator may open (besides `/admin`, `/admin/profile`, and their own venue). */
const OPERATOR_SECTIONS = [
  "/admin/events",
  "/admin/promotions",
  "/admin/faqs",
  "/admin/talents",
  "/admin/segment-galleries",
];

const within = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/** Where to send an operator instead of `pathname`, or null when they may stay. */
function operatorRedirect(pathname: string, venueId: string | null): string | null {
  if (pathname === "/admin" || within(pathname, "/admin/profile")) return null;
  if (!venueId) return "/admin/profile";
  if (within(pathname, "/admin/venues")) {
    // Their own Venue Info page and its /edit; any other venue path goes back to it.
    const own = `/admin/venues/${venueId}`;
    return within(pathname, own) ? null : own;
  }
  if (OPERATOR_SECTIONS.some((prefix) => within(pathname, prefix))) return null;
  return "/admin";
}

/**
 * Page-level gate for `/admin`. Runs on Node (Next 16 proxy), so it can check
 * the user against the DB: deleted users and sessions older than a password
 * change are logged out, and operators are kept inside their allowed sections.
 * Row ownership and every Server Action are re-checked in `src/lib/admin-auth.ts`.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;
  const admin = session
    ? await prisma.adminUser.findUnique({
        where: { id: session.sub },
        select: { role: true, venueId: true, passwordChangedAt: true },
      })
    : null;

  if (!session || !admin || isSessionRevoked(session.iat, admin.passwordChangedAt)) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    if (token) response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/admin", maxAge: 0 });
    return response;
  }

  if (admin.role === "OPERATOR") {
    const target = operatorRedirect(pathname, admin.venueId);
    if (target) return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
