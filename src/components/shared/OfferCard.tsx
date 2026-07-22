import Image from "next/image";

export type OfferCardData = {
  id: string;
  image: string | null;
  title: string;
  description: string;
  venueName: string | null;
  venueLogo: string | null;
  /** Right-side label opposite the venue logo — a date range for promotions, a category for talents. */
  meta: string | null;
};

/** Shared "venue offer" card: image, then [venue logo | meta label], title, description. */
export function OfferCard({ offer }: { offer: OfferCardData }) {
  return (
    <article className="flex flex-col border border-sf-border/50 bg-sf-surface">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sf-surface">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.title}
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
          {offer.venueLogo ? (
            <div className="relative h-7 w-28">
              <Image
                src={offer.venueLogo}
                alt={offer.venueName ?? ""}
                fill
                sizes="112px"
                className="object-contain object-left"
              />
            </div>
          ) : (
            <span className="font-syne text-sm font-bold uppercase text-white">{offer.venueName}</span>
          )}
          <span className="whitespace-nowrap font-inter text-sm text-white">{offer.meta}</span>
        </div>

        <h3 className="font-syne text-2xl font-bold leading-tight text-white">{offer.title}</h3>
        <p className="line-clamp-3 font-inter text-sm leading-relaxed text-white">{offer.description}</p>
      </div>
    </article>
  );
}
