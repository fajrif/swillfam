import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "Venue | SwillFam",
  description:
    "Discover the unique atmosphere and experience at this SwillFam venue.",
};

export default async function VenueSlugPage() {
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
