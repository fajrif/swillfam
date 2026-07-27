import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { ParallaxImage } from "@/components/shared/ParallaxImage";

const FALLBACK = "/private-events/Mask group.png";

/**
 * Detail-page banner: a wide full-bleed image with the private event's name
 * overlaid bottom-left. Flat rather than a StickyHero — the mockup's banner is
 * a partial-height band, the same shape events/[slug] and promotions/[slug] use.
 */
export function PrivateEventBanner({ image, title }: { image: string | null; title: string }) {
  return (
    <div className="relative aspect-[1440/700] max-h-[70svh] min-h-[420px] w-full overflow-hidden bg-sf-surface">
      <ParallaxImage>
        <Image src={image ?? FALLBACK} alt={title} fill sizes="100vw" className="object-cover" priority />
      </ParallaxImage>

      {/* Wash so the heading stays legible over any photograph */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      <Container className="absolute inset-x-0 bottom-0 pb-10 lg:pb-16">
        <h1 className="max-w-4xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
          {title}
        </h1>
      </Container>
    </div>
  );
}
