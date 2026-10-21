import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { ParallaxImage } from "@/components/shared/ParallaxImage";

export function DesignExperienceSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="font-inter text-lg font-thin text-white">The Experience</p>
            <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
              Every Night Feels Different
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-6 font-inter text-xl leading-relaxed">
            <p>
              A night at Kilo Cafe feels nothing like a night at Zoo, and it shouldn&apos;t. One is
              unhurried plates and long conversations; the other is a packed floor that runs late.
            </p>
            <p>
              What carries across every room is how it feels to walk in: a team that&apos;s glad
              you&apos;re here, a space that&apos;s ready for you, and a night that&apos;s been
              thought through before you arrived. Different venues, the same sense of coming home.
            </p>
          </div>
        </div>

        <div className="relative aspect-[1389/570] w-full overflow-hidden border border-sf-border/30">
          <ParallaxImage>
            <Image
              src="/about/the-experience.webp"
              alt="A DJ spraying champagne over a packed dance floor"
              fill
              sizes="(max-width: 1440px) 100vw, 1390px"
              className="object-cover"
            />
          </ParallaxImage>
        </div>
      </Container>
    </section>
  );
}
