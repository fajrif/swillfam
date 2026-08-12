import Image from "next/image";
import Link from "next/link";

export type OfferCardData = {
  id: string;
  image: string | null;
  title: string;
  description: string;
  venueName: string | null;
  venueLogo: string | null;
  /** Right-side label opposite the venue logo — a date range for promotions, a category for talents. */
  meta: string | null;
  /** When set, the whole card becomes a link to this href. */
  href?: string;
};

type OfferCardProps = { offer: OfferCardData };

/** Shared "venue offer" card: image, then [venue logo | meta label], title, description. */
export function OfferCard(props: OfferCardProps) {
  const { offer } = props;
  const inner = (
    <>
      <div className="p-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-sf-surface">
          {offer.image ? (
            <Image
              src={offer.image}
              alt={offer.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-sf-surface" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-4">
          {offer.venueLogo ? (
            // Intrinsic aspect ratio varies per venue (square marks vs. wide wordmarks)
            // and isn't known to this component; native <img> auto-sizes width from a
            // fixed height, which next/image's fill/width+height modes can't do without
            // hardcoding per-logo dimensions that would go stale if a logo is replaced.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={offer.venueLogo}
              alt={offer.venueName ?? ""}
              className="h-8 w-auto max-w-[140px] shrink-0 object-contain object-left"
            />
          ) : (
            <span className="font-syne text-sm font-bold uppercase text-white">{offer.venueName}</span>
          )}
          <span className="whitespace-nowrap font-inter text-sm text-white">{offer.meta}</span>
        </div>

        <h3 className="font-syne text-2xl font-bold leading-tight text-white">{offer.title}</h3>
        <p className="line-clamp-3 font-inter text-sm leading-relaxed">{offer.description}</p>
      </div>
    </>
  );

  const className = "group flex h-full flex-col border border-sf-border/50 bg-sf-surface";

  if (offer.href) {
    return (
      <Link href={offer.href} className={className}>
        {inner}
      </Link>
    );
  }

  return <article className={className}>{inner}</article>;
}
