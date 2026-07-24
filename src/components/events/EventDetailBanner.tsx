import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { ParallaxImage } from "@/components/shared/ParallaxImage";

/**
 * Top of both event detail variants: a "Back to All Events" link over a wide
 * banner. The recurring design overlays the series title on the image; the
 * single design leaves it clean and repeats the name as the heading below.
 */
export function EventDetailBanner({
  image,
  alt,
  title,
}: {
  image: string | null;
  alt: string;
  /** When set, overlaid centred on the banner (recurring variant). */
  title?: string;
}) {
  return (
    <>
      <Container className="pt-30 lg:pt-60">
        <Link
          href="/events"
          className="group inline-flex w-fit items-center gap-3 font-inter text-sm uppercase tracking-[0.06em] text-white"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Back to All Events
        </Link>
      </Container>

      {image ? (
        <Container className="pt-6">
          <div className="relative aspect-[1440/500] w-full overflow-hidden bg-sf-surface">
            <ParallaxImage>
              <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" priority />
            </ParallaxImage>

            {title ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 px-6">
                <h1 className="text-center font-syne text-[clamp(2rem,5vw,64px)] leading-tight text-white">
                  {title}
                </h1>
              </div>
            ) : null}
          </div>
        </Container>
      ) : title ? (
        // No banner to overlay — the title still has to appear as the page's
        // only <h1>, so fall back to a plain heading.
        <Container className="pt-6">
          <h1 className="font-syne text-[clamp(2rem,5vw,64px)] leading-tight text-white">{title}</h1>
        </Container>
      ) : null}
    </>
  );
}
