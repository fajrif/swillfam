import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { ParallaxImage } from "@/components/shared/ParallaxImage";

export function PrivateEventsSection() {
  return (
    <section className="pt-8 pb-16">
      <Container>
        <div className="grid gap-8 p-4 border border-sf-border/40 lg:grid-cols-[7fr_5fr]">
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
                Private Events at SwillFam
              </h2>
              <p className="font-inter leading-relaxed text-white">
                Plan your next corporate gathering, birthday, wedding, brand activation, or private
                celebration with SwillFam&apos;s dedicated venue and event support. From intimate
                occasions to large-scale functions, our team helps create seamless experiences
                tailored to your vision, guests, and event goals.
              </p>
              <p className="font-inter leading-relaxed text-white">
                With flexible spaces, curated food and beverage options, and experienced event
                coordination, we work closely with you to ensure every detail comes together for a
                memorable and successful occasion.
              </p>
            </div>
            <SpecularButton href="/private-events" size="lg" radius={30} className="w-fit">
              Plan Private Events
            </SpecularButton>
          </div>

          <div className="relative aspect-square w-full overflow-hidden border border-sf-border/30">
            <ParallaxImage>
              <Image
                src="/merchandise/private-event.png"
                alt="A SwillFam private event"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </ParallaxImage>
          </div>
        </div>
      </Container>
    </section>
  );
}
