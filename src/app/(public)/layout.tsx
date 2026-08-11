import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { getSiteSettings } from "@/lib/site-settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-body">
      <div className="relative">
        <SiteHeader settings={settings} />
      </div>
      {children}
      <SiteFooter settings={settings} />
    </main>
  );
}
