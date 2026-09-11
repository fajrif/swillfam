"use client";

import { useActionState } from "react";
import { Field, ReadOnlyField, SaveButton } from "@/components/admin/form-fields";
import { ImageManager } from "@/components/admin/ImageManager";
import { Toast, type ToastData } from "@/components/admin/Toast";
import { updateProfileAction, type ProfileActionState } from "./actions";

export function ProfileForm({
  admin,
}: {
  admin: {
    fullName: string;
    email: string;
    position: string | null;
    avatar: string | null;
    roleLabel: string;
    venueName: string | null;
  };
}) {
  const [result, formAction] = useActionState<ProfileActionState, FormData>(updateProfileAction, null);

  const toast: ToastData = result
    ? { type: result.success ? "success" : "error", message: result.message }
    : null;

  return (
    <>
      <form action={formAction} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-3 gap-6">
          {/* Keyed on the saved path so it resets to the stored avatar after each save. */}
          <ImageManager
            key={admin.avatar ?? "none"}
            name="avatar"
            label="Avatar"
            existing={admin.avatar ? [admin.avatar] : []}
            hint="Optional. A square image works best."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name" name="fullName" defaultValue={admin.fullName} required />
          <Field label="Position" name="position" defaultValue={admin.position ?? ""} placeholder="e.g. Venue Manager" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <ReadOnlyField label="Email" value={admin.email} />
          <ReadOnlyField label="Role" value={admin.roleLabel} />
          <ReadOnlyField label="Venue" value={admin.venueName ?? "—"} />
        </div>
        <p className="text-xs text-muted-foreground">Email, role, and venue can only be changed by an administrator.</p>

        <SaveButton>Save profile</SaveButton>
      </form>
      <Toast toast={toast} onDone={() => {}} />
    </>
  );
}
