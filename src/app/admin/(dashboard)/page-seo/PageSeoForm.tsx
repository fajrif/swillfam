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
  initial: {
    key: string;
    label: string;
    path: string;
    defaultTitle: string;
    defaultDescription: string;
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  }[];
}) {
  const [result, formAction] = useActionState<PageSeoActionResult | null, FormData>(updatePageSeoAction, null);

  const toast: ToastData = result
    ? { type: result.success ? "success" : "error", message: result.message }
    : null;

  return (
    <>
      <form action={formAction} className="space-y-8 max-w-3xl">
        {initial.map((page) => (
          <div key={page.key} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{page.label}</h3>
              <Link
                href={page.path}
                target="_blank"
                className="text-xs text-muted-foreground hover:underline"
              >
                {page.path}
              </Link>
            </div>
            {/* What the page emits with these fields blank, so it's clear what
                is being replaced rather than filled in from nothing. */}
            <p className="text-xs text-muted-foreground">
              Default: <span className="text-foreground">{page.defaultTitle}</span>{" "}
              — {page.defaultDescription}
            </p>
            <SeoFields
              titleName={`${page.key}__title`}
              titleValue={page.metaTitle}
              descriptionName={`${page.key}__description`}
              descriptionValue={page.metaDescription}
              ogImageName={`${page.key}__ogImage`}
              ogImageValue={page.ogImage}
            />
          </div>
        ))}
        <SaveButton>Save Page SEO</SaveButton>
      </form>
      <Toast toast={toast} onDone={() => {}} />
    </>
  );
}
