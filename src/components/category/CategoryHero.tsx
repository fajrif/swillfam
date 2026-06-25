import Image from "next/image";
import type { Category } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";

const FALLBACK = "/home/hero.png";

/** Full-bleed banner image + headline (Figma category 558:85 / 558:91). */
export function CategoryHero({ category }: { category: Category }) {
  return (
    <div className="relative h-[715px] w-full overflow-hidden">
      <Image
        src={category.bannerImage ?? category.image ?? FALLBACK}
        alt={category.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-x-0 bottom-0 h-[225px] bg-gradient-to-t from-sf-bg to-transparent" />
      <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
        <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
          {category.headline ?? category.name}
        </h1>
      </Container>
    </div>
  );
}
