import Image from "next/image";

/** Single poster for a promotion — a static image filling the available height. */
export function PromotionImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return <div className="aspect-[4/5] w-full bg-sf-surface" />;
  }

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-contain"
        priority
      />
    </div>
  );
}
