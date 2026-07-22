import Image from "next/image";
import { formatDateRange } from "@/lib/date";

export type PromoCard = {
  id: string;
  name: string;
  shortDescription: string;
  image: string | null;
  venueId: string | null;
  promotionCategoryId: string | null;
  venueName: string | null;
  venueLogo: string | null;
  startDate: Date;
  endDate: Date;
};

/** A single promotion: image + venue logo / date range + title + short description. */
export function PromotionCard({ promo }: { promo: PromoCard }) {
  return (
    <article className="flex flex-col border border-sf-border/50 bg-sf-surface">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sf-surface">
        {promo.image ? (
          <Image
            src={promo.image}
            alt={promo.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-sf-surface" />
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-4">
          {promo.venueLogo ? (
            <div className="relative h-7 w-28">
              <Image
                src={promo.venueLogo}
                alt={promo.venueName ?? ""}
                fill
                sizes="112px"
                className="object-contain object-left"
              />
            </div>
          ) : (
            <span className="font-syne text-sm font-bold uppercase text-white">{promo.venueName}</span>
          )}
          <span className="whitespace-nowrap font-inter text-sm text-white">
            {formatDateRange(promo.startDate, promo.endDate)}
          </span>
        </div>

        <h3 className="font-syne text-2xl font-bold leading-tight text-white">{promo.name}</h3>
        <p className="line-clamp-3 font-inter text-sm leading-relaxed text-white">{promo.shortDescription}</p>
      </div>
    </article>
  );
}
