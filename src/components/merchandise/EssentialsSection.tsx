import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import type { SiteSettings } from "@/lib/site-settings";

export function EssentialsSection({ settings }: { settings: SiteSettings }) {
  const wa = settings.mainWhatsapp ? `https://wa.me/${settings.mainWhatsapp.replace(/[^0-9]/g, "")}` : "#";
  const ig = settings.socialInstagram || "#";

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          SwillFam Essentials
        </h2>
        <p className="max-w-[640px] font-inter leading-relaxed text-white">
          SwillFam merchandise is made for those who live the scene beyond the venue. Explore
          selected pieces inspired by our venues, events, and lifestyle culture. All merchandise are
          available at our venues or kindly DM us to order.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="pill-outline" size="pill">
            <Link href={ig}>DM on Instagram</Link>
          </Button>
          <Button asChild variant="pill-outline" size="pill">
            <Link href={wa}>Inquire via WhatsApp</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
