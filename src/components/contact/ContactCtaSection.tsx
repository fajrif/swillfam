import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

/** Two-card CTA bento (Private Events / Careers), styled like ContinueExperience's text-only cards. */
export function ContactCtaSection() {
  return (
    <section className="pb-16 lg:pb-24">
      <Container>
        <div className="grid border border-sf-border/40 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-6 border-b border-sf-border/40 p-4 lg:border-b-0">
            <div className="flex flex-col gap-4">
              <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                Book Private Events
              </h3>
              <p className="mb-5 font-inter leading-relaxed">
                Celebrations, gatherings, and occasions that deserve a space of their own. Our
                venues can be shaped around your event, giving you the setting and the atmosphere
                to match.
              </p>
            </div>
            <SpecularButton href="/private-events" size="lg" radius={30} className="w-fit">
              Plan Private Events
            </SpecularButton>
          </div>

          <div className="flex flex-col justify-between gap-6 p-4 lg:border-l lg:border-sf-border/40">
            <div className="flex flex-col gap-4">
              <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                Careers Behind The City&apos;s Best Nights
              </h3>
              <p className="mb-5 font-inter leading-relaxed">
                If you want to be part of shaping the city&apos;s dining and nightlife scene,
                we&apos;re always looking for people who bring energy, craft, and character to the
                table.
              </p>
            </div>
            <SpecularButton href="/careers" size="lg" radius={30} className="w-fit">
              View All Careers
            </SpecularButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
