"use client";

import { useActionState } from "react";
import { Field, SaveButton } from "./form-fields";
import { Toast, type ToastData } from "./Toast";
import { PASSWORD_MIN_LENGTH, type PasswordActionState } from "@/lib/password-rules";

/**
 * New + confirm password (plus the current one when `requireCurrent`), reporting
 * the result as a toast. Used for changing your own password on the profile page
 * and for an administrator resetting someone else's.
 */
export function PasswordForm({
  action,
  requireCurrent = false,
  submitLabel = "Update password",
}: {
  action: (state: PasswordActionState, formData: FormData) => Promise<PasswordActionState>;
  requireCurrent?: boolean;
  submitLabel?: string;
}) {
  const [result, formAction] = useActionState(action, null);

  const toast: ToastData = result
    ? { type: result.success ? "success" : "error", message: result.message }
    : null;

  return (
    <>
      <form action={formAction} className="space-y-6 max-w-3xl">
        {requireCurrent && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Current password" name="currentPassword" type="password" required />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="New password"
            name="password"
            type="password"
            required
            hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
          />
          <Field label="Confirm new password" name="confirmPassword" type="password" required hint=" " />
        </div>
        <SaveButton>{submitLabel}</SaveButton>
      </form>
      <Toast toast={toast} onDone={() => {}} />
    </>
  );
}
