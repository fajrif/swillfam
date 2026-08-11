import { Container } from "@/components/shared/Container";
import { whatsappHref } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/site-settings";

export function GetInTouchSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          Get in Touch with SwillFam
        </h2>

        <div className="flex flex-col gap-6">
          <p className="font-inter leading-relaxed">
            For general inquiries, business opportunities, collaborations, media requests, private
            events, and other questions, you can contact the SwillFam team through our form,
            WhatsApp, email, or location details.
          </p>
          <p className="font-inter leading-relaxed">
            Whether you are planning a visit, organizing an event, looking for venue information, or
            reaching out on behalf of a brand or media partner, our team will direct your message to
            the right department.
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
