"use client";

import { useActionState, useState } from "react";
import type { AdminRole } from "@/generated/prisma/client";
import type { AdminUserFormState } from "@/app/admin/(dashboard)/users/actions";
import { ADMIN_ROLE_LABEL, ADMIN_ROLE_OPTIONS } from "@/lib/admin-roles";
import { PASSWORD_MIN_LENGTH } from "@/lib/password-rules";
import { Field, SelectField, ReadOnlyField, SaveButton } from "./form-fields";
import { ImageManager } from "./ImageManager";

type AdminUserFields = {
  fullName: string;
  email: string;
  position: string | null;
  avatar: string | null;
  role: AdminRole;
  venueId: string | null;
};

export function AdminUserForm({
  action,
  user,
  venues,
  isSelf = false,
}: {
  action: (state: AdminUserFormState, formData: FormData) => Promise<AdminUserFormState>;
  /** Omitted on create — that's also when the password fields show. */
  user?: AdminUserFields;
  venues: { id: string; name: string }[];
  /** Editing your own account: your role is read-only (the server enforces it too). */
  isSelf?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const values = state?.values;
  const [role, setRole] = useState<string>(values?.role ?? user?.role ?? "OPERATOR");

  return (
    // Remount on each failed attempt so the fields show what was just submitted.
    <form key={state?.at ?? "initial"} action={formAction} className="space-y-6 max-w-3xl">
      {state?.error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-3 gap-6">
        <ImageManager
          name="avatar"
          label="Avatar"
          existing={user?.avatar ? [user.avatar] : []}
          hint="Optional. A square image works best."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Full name" name="fullName" defaultValue={values?.fullName ?? user?.fullName} required hint=" " />
        <Field label="Email" name="email" type="email" defaultValue={values?.email ?? user?.email} required hint="Used to sign in." />
      </div>

      <Field
        label="Position"
        name="position"
        defaultValue={values?.position ?? user?.position ?? ""}
        placeholder="e.g. Venue Manager"
      />

      <div className="grid grid-cols-2 gap-4">
        {isSelf && user ? (
          <>
            <ReadOnlyField label="Role" value={ADMIN_ROLE_LABEL[user.role]} hint="You can't change your own role." />
            <input type="hidden" name="role" value={user.role} />
          </>
        ) : (
          <SelectField
            label="Role"
            name="role"
            defaultValue={role}
            options={ADMIN_ROLE_OPTIONS}
            onValueChange={setRole}
            required
            hint="Administrators manage everything; operators only their own venue."
          />
        )}
        {role === "OPERATOR" && (
          <SelectField
            label="Venue"
            name="venueId"
            defaultValue={values?.venueId ?? user?.venueId ?? ""}
            blankLabel="— Select a venue —"
            options={venues.map((v) => ({ value: v.id, label: v.name }))}
            required
            hint="The only venue this operator can manage."
          />
        )}
      </div>

      {!user && (
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Password"
            name="password"
            type="password"
            required
            hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
          />
          <Field label="Confirm password" name="confirmPassword" type="password" required hint=" " />
        </div>
      )}

      <SaveButton>Save user</SaveButton>
    </form>
  );
}
