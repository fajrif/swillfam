import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { ParallaxImage } from "@/components/shared/ParallaxImage";

export function CareersSection() {
  return (
    <section className="pt-4 pb-16">
      <Container>
        <div className="grid gap-8 p-4 border border-sf-border/40 lg:grid-cols-[7fr_5fr]">
          <div className="order-2 flex flex-col justify-between lg:order-1">
            <div className="flex flex-col gap-6">
              <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
                Careers at SwillFam
              </h2>
              <p className="font-inter leading-relaxed">
                Behind every SwillFam experience is a team of people who bring the energy to life. From
                venue operations and hospitality to marketing, events, creative, and management, our
                team plays an important role in shaping every guest experience.
              </p>
              <p className="mb-5 font-inter leading-relaxed">
                If you are passionate about lifestyle, hospitality, nightlife, food and beverage, or
                creative experiences, SwillFam is always open to discovering people who want to grow
                with us.
              </p>
            </div>
            <SpecularButton href="/careers" size="lg" radius={30} className="w-fit">
              View All Careers
            </SpecularButton>
          </div>

          <div className="order-1 relative aspect-[4/3] w-full overflow-hidden border border-sf-border/30 lg:order-2">
            <ParallaxImage>
              <Image
                src="/about/career-swilfam.png"
                alt="Join the SwillFam team"
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
