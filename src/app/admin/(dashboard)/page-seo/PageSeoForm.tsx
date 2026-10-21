"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SaveButton } from "@/components/admin/form-fields";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DetailSeoTabs } from "@/components/admin/EditPageTabs";
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
    seoPanel: React.ReactNode;
  }[];
}) {
  const [result, formAction] = useActionState<PageSeoActionResult | null, FormData>(
    updatePageSeoAction,
    null,
  );

  const toast: ToastData = result
    ? { type: result.success ? "success" : "error", message: result.message }
    : null;

  return (
    <>
      <form action={formAction} className="space-y-8 max-w-5xl">
        {/* One tab per page, but still one form: every page's panel stays
            mounted (hidden, not unmounted) so all 16 are posted by one Save. */}
        <Tabs
          defaultValue={initial[0].key}
          className="items-start gap-8 data-[orientation=horizontal]:flex-row"
        >
          {/* A vertical list, so the page picker can't be mistaken for the
              Detail Info / SEO Details tabs inside each page. Laid out with
              classes, not `orientation="vertical"`: the Tabs primitive's
              `group-data-[orientation=vertical]/tabs:` variants match any
              ancestor, so a vertical outer group would also restyle the
              horizontal tabs nested inside it. */}
          <TabsList className="w-56 shrink-0 flex-col group-data-[orientation=horizontal]/tabs:h-fit">
            {initial.map((page) => (
              <TabsTrigger
                key={page.key}
                value={page.key}
                className="h-8 w-full flex-none justify-start px-3"
              >
                {page.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {initial.map((page) => (
            <TabsContent
              key={page.key}
              value={page.key}
              forceMount
              className="min-w-0 space-y-3 data-[state=inactive]:hidden"
            >
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
              <DetailSeoTabs
                details={
                  <div className="space-y-3">
                    {/* What the page emits with these fields blank, so it's clear what
                    is being replaced rather than filled in from nothing. */}
                    <p className="text-xs text-muted-foreground">
                      Default: <span className="text-foreground">{page.defaultTitle}</span> —{" "}
                      {page.defaultDescription}
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
                }
                seo={page.seoPanel}
              />
            </TabsContent>
          ))}
        </Tabs>
        <SaveButton>Save Page SEO</SaveButton>
      </form>
      <Toast toast={toast} onDone={() => {}} />
    </>
  );
}
