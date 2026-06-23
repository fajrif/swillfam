import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "./SectionHeading";

/** Explore by Category (Figma 302:2) — two photo tiles with overlay labels. */
export function ExploreCategory() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-10">
        <SectionHeading title="Explore by Category" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <CategoryTile src="/home/category-lifestyle.png" label="Lifestyle" labelAlign="top-left" />
          <CategoryTile
            src="/home/category-nightlife.png"
            label="Nightlife"
            labelAlign="bottom-right"
          />
        </div>
      </Container>
    </section>
  );
}

function CategoryTile({
  src,
  label,
  labelAlign,
}: {
  src: string;
  label: string;
  labelAlign: "top-left" | "bottom-right";
}) {
  return (
    <div className="group relative aspect-[645/614] overflow-hidden">
      <div className="absolute inset-0 border border-sf-border/50 p-2 overflow-hidden">
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover scale-[0.97] transition-transform duration-700 group-hover:scale-100"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <span
        className={cn(
          "absolute p-6 font-syne text-[clamp(2rem,4vw,48px)] font-extrabold uppercase leading-none text-white lg:p-8",
          labelAlign === "top-left" ? "left-0 top-0" : "bottom-0 right-0 text-right",
        )}
      >
        {label}
      </span>
    </div>
  );
}
