"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SaveButton } from "@/components/admin/form-fields";
import { SeoFields } from "@/components/admin/SeoFields";
import { Toast, type ToastData } from "@/components/admin/Toast";
import { updatePageSeoAction, type PageSeoActionResult } from "./actions";

export function PageSeoForm({
  initial,
}: {
  initial: { key: string; label: string; path: string; metaTitle: string; metaDescription: string }[];
}) {
  const [result, formAction] = useActionState<PageSeoActionResult | null, FormData>(updatePageSeoAction, null);

  const toast: ToastData = result
    ? { type: result.success ? "success" : "error", message: result.message }
    : null;

  return (
    <>
      <form action={formAction} className="space-y-8 max-w-3xl">
        {initial.map(({ key, label, path, metaTitle, metaDescription }) => (
          <div key={key} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{label}</h3>
              <Link href={path} target="_blank" className="text-xs text-muted-foreground hover:underline">
                {path}
              </Link>
            </div>
            <SeoFields
              titleName={`${key}__title`}
              titleValue={metaTitle}
              descriptionName={`${key}__description`}
              descriptionValue={metaDescription}
            />
          </div>
        ))}
        <SaveButton>Save Page SEO</SaveButton>
      </form>
      <Toast toast={toast} onDone={() => {}} />
    </>
  );
}
