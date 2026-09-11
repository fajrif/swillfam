/**
 * Admin password rules. Client-safe on purpose (no bcrypt import), so forms can
 * show the same minimum the Server Actions enforce.
 */
export const PASSWORD_MIN_LENGTH = 8;

/** bcrypt work factor for admin password hashes (actions and seeds). */
export const BCRYPT_COST = 12;

export type PasswordActionState = { success: boolean; message: string } | null;

export function passwordError(password: string, confirm: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password !== confirm) return "Passwords don't match.";
  return null;
}
