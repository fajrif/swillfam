import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

export type ProductRow = {
  img: string | null;
  title: string;
  description: string;
  price: string;
};

/** 3-column merchandise grid + a Load More link, shown when more rows exist. */
export function ProductGrid({
  products,
  hasMore,
  loadMoreHref,
}: {
  products: ProductRow[];
  hasMore: boolean;
  loadMoreHref: string;
}) {
  return (
    <section className="pb-16 lg:pb-24">
      <Container className="flex flex-col items-center gap-12">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>

        {hasMore && (
          <Button asChild variant="swillfam" size="pill">
            <Link href={loadMoreHref}>Load More</Link>
          </Button>
        )}
      </Container>
    </section>
  );
}

function ProductCard({ img, title, description, price }: ProductRow) {
  return (
    <article className="flex flex-col border border-sf-border/50">
      <div className="relative aspect-square w-full overflow-hidden bg-sf-surface">
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-10"
          />
        ) : (
          <div className="absolute inset-0 bg-sf-surface" />
        )}
      </div>
      <div className="flex flex-col items-center gap-2 p-6 text-center bg-sf-surface">
        <h3 className="font-syne text-xl text-white">{title}</h3>
        <p className="font-inter text-sm leading-relaxed text-white">{description}</p>
        <p className="mt-2 font-syne text-lg font-bold text-white">{price}</p>
      </div>
    </article>
  );
}
