export const SESSION_COOKIE_NAME = "swillfam_admin_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  // Deliberately NOT tied to NODE_ENV: a production build can still be served over
  // plain HTTP (e.g. IP-only, pre-SSL). A `secure` cookie is silently dropped by the
  // browser on non-HTTPS connections, which looks like an instant logout. Flip
  // COOKIE_SECURE=true in .env once the site is actually served over HTTPS.
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "lax" as const,
  path: "/admin",
  maxAge: 60 * 60 * 24 * 7, // 7 days, matches signSession's expiration
};
