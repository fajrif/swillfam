import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "Talent | SwillFam",
  description:
    "Learn more about this SwillFam talent.",
};

export default async function TalentSlugPage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      <div className="relative">
        <SiteHeader />
      </div>
      <SiteFooter settings={settings} />
    </main>
  );
}
