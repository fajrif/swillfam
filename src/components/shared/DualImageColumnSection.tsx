import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/home/SectionHeading";

export type CategoryTileData = {
  src: string;
  label: string;
  labelAlign: "top-left" | "bottom-right";
  description?: string;
};

const DEFAULT_TILES: CategoryTileData[] = [
  { src: "/home/category-lifestyle.png", label: "Lifestyle", labelAlign: "top-left" },
  { src: "/home/category-nightlife.png", label: "Nightlife", labelAlign: "bottom-right" },
];

/**
 * Two photo tiles with overlay labels (Figma home 302:2).
 * Prop-driven so it can be reused — defaults reproduce the homepage "Explore by
 * Category" section when rendered with no props. `description` adds a paragraph
 * under each tile label (used by the About "Vision & Mission" section).
 */
export function DualImageColumnSection({
  title = "Explore by Category",
  description,
  titleClassName,
  tiles = DEFAULT_TILES,
}: {
  title?: string;
  description?: string;
  titleClassName?: string;
  tiles?: CategoryTileData[];
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:gap-10">
        {title ? (
          <SectionHeading title={title} lead={description} titleClassName={titleClassName} />
        ) : null}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {tiles.map((tile) => (
            <CategoryTile key={tile.label} {...tile} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function CategoryTile({ src, label, labelAlign, description }: CategoryTileData) {
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
      <div
        className={cn(
          "absolute flex max-w-[420px] flex-col gap-3 p-6 lg:p-8",
          labelAlign === "top-left"
            ? "left-0 top-0 items-start text-left"
            : "bottom-0 right-0 items-end text-right",
        )}
      >
        <span className="font-syne text-[clamp(2rem,4vw,48px)] font-extrabold uppercase leading-none text-white">
          {label}
        </span>
        {description ? (
          <p className="font-inter text-sm leading-relaxed text-white md:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
