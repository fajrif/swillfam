import { NextResponse, type NextRequest } from "next/server";
import { isSessionRevoked, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isExpiredPromotion } from "@/lib/promotion-scope";
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
 * 301 an expired promotion to the archive, per the brief.
 *
 * It lives here rather than in the page for two reasons. A page can only
 * redirect through `permanentRedirect()`, which emits **308** and offers no way
 * to choose the code — and the brief, the redirect map and the SEO team's curl
 * checks all specify 301, which is why `next.config.ts` spells out
 * `statusCode: 301` instead of using `permanent: true`. Next's own guidance is
 * that a redirect decided before render belongs in the config or the proxy.
 *
 * Deciding it here also means it is evaluated per request against the real
 * clock, instead of being frozen into a prerendered page until its next
 * `revalidate`, and an expired offer never costs a render at all.
 *
 * The cost is one indexed `endDate` lookup per `/promotions/{slug}` hit, which
 * is less work than the page it replaces.
 */
async function expiredPromotionRedirect(request: NextRequest): Promise<NextResponse | null> {
  // The matcher below is `/promotions/:slug`, so there is exactly one segment.
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!slug) return null;

  const promotion = await prisma.promotion.findUnique({
    where: { slug },
    select: { endDate: true, published: true },
  });
  // Unknown slug: let the page 404 rather than redirecting a URL that never
  // existed — a 301 to /promotions would be a soft 404 for a typo.
  // A draft is left to 404 as well: redirecting it would announce it exists.
  if (!promotion || !promotion.published || !isExpiredPromotion(promotion, new Date())) return null;

  return NextResponse.redirect(new URL("/promotions", request.url), 301);
}

/**
 * Page-level gate for `/admin`. Runs on Node (Next 16 proxy), so it can check
 * the user against the DB: deleted users and sessions older than a password
 * change are logged out, and operators are kept inside their allowed sections.
 * Row ownership and every Server Action are re-checked in `src/lib/admin-auth.ts`.
 */
async function adminGate(request: NextRequest): Promise<NextResponse> {
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

export async function proxy(request: NextRequest) {
  if (within(request.nextUrl.pathname, "/promotions")) {
    return (await expiredPromotionRedirect(request)) ?? NextResponse.next();
  }
  return adminGate(request);
}

export const config = {
  // Keep this list tight: every matched path pays the proxy's cost, and
  // `/promotions/:slug` is matched only because an expired offer has to 301
  // before the page renders.
  matcher: ["/admin/:path*", "/promotions/:slug"],
};
