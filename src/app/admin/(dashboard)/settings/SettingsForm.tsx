"use client";

import { useActionState } from "react";
import { Field, SaveButton } from "@/components/admin/form-fields";
import { Toast, type ToastData } from "@/components/admin/Toast";
import { updateSettingsAction, type SettingsActionResult } from "./actions";

const SETTINGS_META: { key: string; label: string }[] = [
  { key: "mainEmail", label: "Main email" },
  { key: "mainWhatsapp", label: "Main WhatsApp number" },
  { key: "mainPhone", label: "Main phone number" },
  { key: "officeAddressLine1", label: "Office address — line 1" },
  { key: "officeAddressLine2", label: "Office address — line 2" },
  { key: "officeAddressCity", label: "Office address — city / postal" },
  { key: "socialLinkedin", label: "LinkedIn URL" },
  { key: "socialTiktok", label: "TikTok URL" },
  { key: "socialYoutube", label: "YouTube URL" },
  { key: "socialInstagram", label: "Instagram URL" },
];

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [result, formAction] = useActionState<SettingsActionResult | null, FormData>(updateSettingsAction, null);

  const toast: ToastData = result
    ? { type: result.success ? "success" : "error", message: result.message }
    : null;

  return (
    <>
      <form action={formAction} className="space-y-6 max-w-3xl">
        {SETTINGS_META.map(({ key, label }) => (
          <Field key={key} label={label} name={key} defaultValue={initial[key] ?? ""} />
        ))}
        <SaveButton>Save settings</SaveButton>
      </form>
      <Toast toast={toast} onDone={() => {}} />
    </>
  );
}
