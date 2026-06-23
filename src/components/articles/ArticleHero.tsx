import Image from "next/image";
import { Container } from "@/components/shared/Container";

/** Single-article hero: cover image (falls back to the dev sample) + overlay title. */
export function ArticleHero({ title, image }: { title: string; image: string | null }) {
  return (
    <div className="relative h-[715px] w-full overflow-hidden">
      <Image
        src={image ?? "/articles/sample-banner.png"}
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-x-0 bottom-0 h-[225px] bg-gradient-to-t from-sf-bg to-transparent" />
      <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
        <h1 className="max-w-4xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
          {title}
        </h1>
      </Container>
    </div>
  );
}
