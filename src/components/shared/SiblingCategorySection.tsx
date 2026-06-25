import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";

const FALLBACK = "/home/hero.png";

/**
 * Cross-promo to a category — bordered split card: name + shortDescription + CTA
 * and an image. Image sits on the right by default; pass `imagePosition="left"`
 * to flip it (used for the zig-zag on /venues). Figma category 558:345.
 */
export function SiblingCategorySection({
  category,
  imagePosition = "right",
  sectionClassName = "py-8 lg:py-16",
}: {
  category: Category;
  imagePosition?: "left" | "right";
  sectionClassName?: string;
}) {
  const imageLeft = imagePosition === "left";

  return (
    <section className={sectionClassName}>
      <Container>
        <div className="grid gap-8 border border-sf-border/40 p-4 lg:grid-cols-2">
          <div
            className={cn(
              "flex flex-col justify-between gap-6 lg:p-6",
              imageLeft && "lg:order-2",
            )}
          >
            <div>
              <h2 className="font-syne text-[clamp(2rem,4vw,64px)] leading-tight text-white mb-4">
                {category.name}
              </h2>
              <p className="whitespace-pre-line font-inter leading-relaxed text-white">
                {category.shortDescription ?? category.caption}
              </p>
            </div>
            <Button asChild variant="swillfam" size="pill" className="w-fit">
              <Link href={`/category/${category.slug}`}>See {category.name}</Link>
            </Button>
          </div>

          <div
            className={cn(
              "group relative aspect-[645/614] w-full overflow-hidden border border-sf-border/30",
              imageLeft && "lg:order-1",
            )}
          >
            <Image
              src={category.image ?? FALLBACK}
              alt={category.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover scale-[0.97] transition-transform duration-700 group-hover:scale-100"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
