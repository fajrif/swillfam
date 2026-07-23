import type { Promotion, Venue } from "@/generated/prisma/client";
import type { SiteSettings } from "@/lib/site-settings";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { formatDateRange } from "@/lib/date";
import { whatsappHref } from "@/lib/whatsapp";
import { PromotionGallery } from "./PromotionGallery";

type PromotionWithVenue = Promotion & { venue: Venue | null };

/** Top of the single-promotion page: poster (left) + details, terms, and actions (right). */
export function PromotionDetailTop({
  promotion,
  settings,
}: {
  promotion: PromotionWithVenue;
  settings: SiteSettings;
}) {
  const images = [...new Set([promotion.posterImage, promotion.image, promotion.bannerImage].filter(Boolean))] as string[];
  const venue = promotion.venue;
  const whatsapp = settings.mainWhatsapp;

  return (
    <section className="pt-8 pb-16 lg:pt-12">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <PromotionGallery images={images} alt={promotion.name} />

        <div className="flex flex-col gap-6">
          <h1 className="font-syne text-[clamp(2rem,4vw,52px)] leading-[1.05] text-white">
            {promotion.name}
          </h1>

          <div className="flex flex-col gap-3">
            <h2 className="font-syne text-xl font-bold text-white">About This Promotion</h2>
            <p className="whitespace-pre-line font-inter leading-relaxed text-white">
              {promotion.description}
            </p>
          </div>

          <dl className="flex flex-col gap-1 font-inter text-white">
            {venue ? (
              <div className="flex gap-2">
                <dt className="font-semibold">Venue:</dt>
                <dd>{venue.name}</dd>
              </div>
            ) : null}
            {venue?.location ? (
              <div className="flex gap-2">
                <dt className="font-semibold">Location:</dt>
                <dd>{venue.location}</dd>
              </div>
            ) : null}
            <div className="flex gap-2">
              <dt className="font-semibold">Valid:</dt>
              <dd>{formatDateRange(promotion.startDate, promotion.endDate)}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-1 font-inter text-white">
            <p className="font-semibold">Operating Hours:</p>
            <p className="whitespace-pre-line">
              {venue?.operatingHours ?? `${promotion.startHour} – ${promotion.endHour}`}
            </p>
          </div>

          {promotion.terms ? (
            <div className="flex flex-col gap-3">
              <h2 className="font-syne text-xl font-bold text-white">Terms &amp; Conditions</h2>
              <div
                className="font-inter text-sm leading-relaxed text-white [&_a]:underline [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: promotion.terms }}
              />
            </div>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            {whatsapp ? (
              <SpecularButton
                href={whatsappHref(
                  whatsapp,
                  `Hi SwillFam, I'm interested in the "${promotion.name}"${venue ? ` promotion at ${venue.name}` : " promotion"}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                radius={30}
                className="w-fit"
              >
                Reserve via WhatsApp
              </SpecularButton>
            ) : (
              <span />
            )}

          </div>
        </div>
      </Container>
    </section>
  );
}
