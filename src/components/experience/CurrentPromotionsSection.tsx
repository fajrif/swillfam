import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { PROMOS } from "./data";

/** "Current Promotions" — centered heading + 3-col promo cards. */
export function CurrentPromotionsSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        <div className="mx-auto flex max-w-[640px] flex-col gap-4 text-center">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            Current Promotions
          </h2>
          <p className="font-inter leading-relaxed text-white">
            Make your next SwillFam visit even better with active promotions across our venues.
            Explore selected offers for food, drinks, ladies night, group packages, table deals, and
            seasonal specials.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROMOS.map((promo, i) => (
            <article key={i} className="flex flex-col gap-4 border border-sf-border/50 p-4">
              <div className="relative aspect-[407/349] w-full overflow-hidden bg-sf-surface">
                <Image
                  src={promo.img}
                  alt={promo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <span className="font-syne text-sm text-white">{promo.venue}</span>
                  <span className="font-inter text-xs text-white">{promo.date}</span>
                </div>
              </div>
              <h3 className="font-syne text-2xl text-white">{promo.title}</h3>
              <p className="font-inter text-sm leading-relaxed text-white">{promo.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
