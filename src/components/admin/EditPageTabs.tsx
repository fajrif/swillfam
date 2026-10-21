import type { ReactNode } from "react";
import { Card } from "@/components/admin/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/**
 * "Detail Info" / "SEO Details" tabs for an edit page. `details` is the form
 * (and its delete button); `seo` is the read-only `SeoDetailsPanel`.
 *
 * The form tab is force-mounted and only hidden, never unmounted: a Radix tab
 * that isn't active unmounts its children, which would throw away whatever was
 * typed or uploaded the moment someone peeked at the SEO tab. The SEO tab is
 * left to mount on first open on purpose — its JSON-LD preview fetches the
 * public page, and that shouldn't happen for everyone who just opened a form.
 */
export function EditPageTabs({ details, seo }: { details: ReactNode; seo: ReactNode }) {
  return (
    <Card>
      <Tabs defaultValue="details" className="gap-6">
        <TabsList>
          <TabsTrigger value="details">Detail Info</TabsTrigger>
          <TabsTrigger value="seo">SEO Details</TabsTrigger>
        </TabsList>
        <TabsContent value="details" forceMount className="data-[state=inactive]:hidden">
          {details}
        </TabsContent>
        <TabsContent value="seo">{seo}</TabsContent>
      </Tabs>
    </Card>
  );
}
