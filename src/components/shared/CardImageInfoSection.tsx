import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

export type TrustedCard = {
  img?: string;
  title: string;
  description: string;
};

const DEFAULT_LEAD =
  "SwillFam continues to grow through the people who visit, celebrate, dine, and create memories with us. Our venues are shaped by the energy of our guests, our teams, and the communities that make every experience feel alive.";

const DEFAULT_DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const DEFAULT_CARDS: TrustedCard[] = [
  { img: "/home/trusted-1.png", title: "Lorem Ipsum", description: DEFAULT_DESCRIPTION },
  { img: "/home/trusted-2.png", title: "Lorem Ipsum", description: DEFAULT_DESCRIPTION },
  { img: "/home/trusted-3.png", title: "Lorem Ipsum", description: DEFAULT_DESCRIPTION },
];

/**
 * Bordered card row with a centered section heading (Figma home 441:48).
 * Prop-driven so it can be reused — defaults reproduce the homepage "Trusted by
 * the City's Crowd" section exactly when rendered with no props.
 */
export function CardImageInfoSection({
  title = "Trusted by the City's Crowd",
  lead = DEFAULT_LEAD,
  cards = DEFAULT_CARDS,
  align = "center",
}: {
  title?: string;
  lead?: string;
  cards?: TrustedCard[];
  align?: "left" | "center";
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-12">
        <SectionHeading align={align} title={title} lead={lead} />

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <article
              key={i}
              className="flex flex-col items-center gap-6 border border-sf-border/50 bg-sf-surface p-8 text-center"
            >
              {card.img ? (
                <div className="relative aspect-square w-full max-w-[260px]">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain"
                  />
                </div>
              ) : null}
              <div className="flex flex-col items-center gap-3">
                <h3 className="font-syne text-2xl font-bold text-white">{card.title}</h3>
                <p className="font-inter text-sm leading-relaxed text-white">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
