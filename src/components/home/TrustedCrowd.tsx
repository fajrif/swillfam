import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";

const CARDS = [
  { img: "/home/trusted-1.png", title: "Lorem Ipsum", aspectClass: "aspect-[314/177]" },
  { img: "/home/trusted-2.png", title: "Lorem Ipsum", aspectClass: "aspect-square", elevated: true },
  { img: "/home/trusted-3.png", title: "Lorem Ipsum", aspectClass: "aspect-[41/23]" },
];

/** Trusted by the City's Crowd (Figma 441:48) — 3 staggered floating community images. */
export function TrustedCrowd() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-12">
        <SectionHeading
          align="center"
          title="Trusted by the City's Crowd"
          lead="SwillFam continues to grow through the people who visit, celebrate, dine, and create memories with us. Our venues are shaped by the energy of our guests, our teams, and the communities that make every experience feel alive."
        />

        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-3 md:items-end">
          {CARDS.map((card, i) => (
            <article
              key={i}
              className={cn(
                "flex flex-col gap-5",
                card.elevated && "md:-translate-y-10",
              )}
            >
              <div className={cn("relative w-full overflow-hidden", card.aspectClass)}>
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-syne text-2xl font-bold text-white">{card.title}</h3>
                <p className="font-inter text-sm leading-relaxed text-white/70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
