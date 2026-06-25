import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

export type CategoryTileData = {
  src: string;
  label: string;
  labelAlign: "top-left" | "bottom-right";
  description?: string;
  href?: string;
};

export function DualImageColumnSection({
  title = "Explore by Category",
  description,
  titleClassName,
  tiles,
}: {
  title?: string;
  description?: string;
  titleClassName?: string;
  tiles: CategoryTileData[];
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

function CategoryTile({ src, label, labelAlign, description, href }: CategoryTileData) {
  const content = (
    <>
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
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group relative aspect-[645/614] overflow-hidden block">
        {content}
      </Link>
    );
  }

  return (
    <div className="group relative aspect-[645/614] overflow-hidden">
      {content}
    </div>
  );
}
