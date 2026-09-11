import { SignJWT, jwtVerify } from "jose";

const SESSION_DURATION = "7d";

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export type AdminSessionPayload = {
  sub: string;
  email: string;
};

export async function signSession(payload: AdminSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySession(
  token: string,
): Promise<(AdminSessionPayload & { iat: number }) | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    if (typeof payload.iat !== "number") return null;
    return { sub: payload.sub, email: payload.email, iat: payload.iat };
  } catch {
    return null;
  }
}

/**
 * A session issued (`iat`, seconds) before the user's last password change is
 * revoked. `passwordChangedAt` is stored floored to the second — see
 * `passwordChangeTimestamp` — so a token re-issued right after the change survives.
 */
export function isSessionRevoked(iat: number, passwordChangedAt: Date | null) {
  return !!passwordChangedAt && iat * 1000 < passwordChangedAt.getTime();
}

/** "Now", floored to whole seconds to line up with JWT `iat` precision. */
export function passwordChangeTimestamp() {
  return new Date(Math.floor(Date.now() / 1000) * 1000);
}
