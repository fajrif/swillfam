import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/** Intro: eyebrow + title (left) + body paragraphs + CTA (right). */
export function VisionSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="font-inter text-lg font-thin text-white">Philosophy &amp; Experience</p>
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            Events Designed Around Your Vision
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-inter leading-relaxed">
            Whether you&apos;re organizing a corporate function, birthday celebration, brand launch,
            wedding reception, or private gathering, SwillFam provides distinctive venues and flexible
            event solutions across our portfolio.
          </p>
          <p className="font-inter leading-relaxed">
            Each space is designed with its own character, giving you the freedom to choose an
            atmosphere that matches the tone of your event, from relaxed and intimate to energetic,
            premium, and high-impact.
          </p>
          <p className="font-inter leading-relaxed">
            Our team works closely with you to understand your objectives, guest list, preferred
            setup, food and beverage needs, entertainment direction, and overall event flow. From the
            first inquiry to the final execution, we help shape the experience so every detail feels
            aligned with your vision.
          </p>
          <SpecularButton href="/venues" size="lg" radius={30} className="w-fit">
            View All Venues
          </SpecularButton>
        </div>
      </Container>
    </section>
  );
}
