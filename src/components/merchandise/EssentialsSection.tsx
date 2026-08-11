import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
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
        <p className="max-w-[640px] font-inter leading-relaxed">
          SwillFam merchandise is made for those who live the scene beyond the venue. Explore
          selected pieces inspired by our venues, events, and lifestyle culture. All merchandise are
          available at our venues or kindly DM us to order.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <SpecularButton href={ig} target="_blank" rel="noopener noreferrer" size="lg" radius={30}>
            DM on Instagram
          </SpecularButton>
          <SpecularButton href={wa} target="_blank" rel="noopener noreferrer" size="lg" radius={30}>
            Inquire via WhatsApp
          </SpecularButton>
        </div>
      </Container>
    </section>
  );
}
