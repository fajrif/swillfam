export const SESSION_COOKIE_NAME = "laci_admin_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/admin",
  maxAge: 60 * 60 * 24 * 7, // 7 days, matches signSession's expiration
};
