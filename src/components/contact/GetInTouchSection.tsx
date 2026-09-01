import { Container } from "@/components/shared/Container";
import { whatsappHref } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/site-settings";

export function GetInTouchSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          Start the Conversation
        </h2>

        <div className="flex flex-col gap-6">
          <p className="font-inter leading-relaxed">
            A reservation, an event you&apos;re planning, a partnership worth exploring, or just a
            question about one of our venues, whatever brings you here, we&apos;re always listening.
            Send us a message and someone from the SwillFam team will be in touch soon.
          </p>
          <div className="mt-2 flex flex-col gap-1 font-inter text-xl">
            {settings.mainWhatsapp && (
              <p>
                WhatsApp:{" "}
                <a
                  href={whatsappHref(settings.mainWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-sf-accent"
                >
                  {settings.mainWhatsapp}
                </a>
              </p>
            )}
            {settings.mainPhone && (
              <p>
                Phone:{" "}
                <a
                  href={`tel:${settings.mainPhone}`}
                  className="transition-colors hover:text-sf-accent"
                >
                  {settings.mainPhone}
                </a>
              </p>
            )}
            {settings.mainEmail && (
              <p>
                Email:{" "}
                <a
                  href={`mailto:${settings.mainEmail}`}
                  className="transition-colors hover:text-sf-accent"
                >
                  {settings.mainEmail}
                </a>
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
