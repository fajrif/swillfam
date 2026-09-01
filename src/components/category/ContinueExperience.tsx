import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { ParallaxImage } from "@/components/shared/ParallaxImage";

/**
 * "Continue the Experience" bento (Figma category 860:1333-1358).
 * Row 1 mirrors `about/StandForColumnsSection` (`[8fr_4fr]`): image + text card,
 * then a text-only card. Row 2 is `merchandise/PrivateEventsSection` with an extra
 * left column (`[4fr_8fr]`): a text-only card, then a text + image card.
 * Static marketing copy; images reuse existing public assets.
 */
export function ContinueExperience() {
  return (
    <section className="py-8 lg:py-16">
      <Container className="flex flex-col gap-6">
        {/* Row 1 — [8fr_4fr] */}
        <div className="grid border border-sf-border/40 lg:grid-cols-[8fr_4fr]">
          {/* Continue the Experience — image + text */}
          <div className="flex flex-col gap-8 border-b border-sf-border/40 p-4 sm:flex-row lg:border-b-0">
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:w-[400px]">
              <ParallaxImage>
                <Image
                  src="/image1.png"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </ParallaxImage>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                  Plan Your Swillfam Day
                </h3>
                <p className="mb-5 font-inter leading-relaxed">
                  Morning coffee, an easy lunch, sundown drinks, or a night that runs late, every
                  part of the day has a space made for it. Discover where to go, and when, so every
                  hour feels like the right one.
                </p>
              </div>
              <SpecularButton href="/experience" size="lg" radius={30} className="w-fit">
                Discover Experiences
              </SpecularButton>
            </div>
          </div>

          {/* Explore Events — text only */}
          <div className="flex flex-col justify-between gap-6 p-4 lg:border-l lg:border-sf-border/40">
            <div className="flex flex-col gap-4">
              <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                See What&apos;s Happening
              </h3>
              <p className="mb-5 font-inter leading-relaxed">
                New nights, featured collaborations, and moments worth showing up for. Stay close
                to what&apos;s currently on across every SwillFam venue and catch the next one
                before it passes.
              </p>
            </div>
            <SpecularButton href="/events" size="lg" radius={30} className="w-fit">
              View Events
            </SpecularButton>
          </div>
        </div>

        {/* Row 2 — [4fr_8fr] */}
        <div className="grid border border-sf-border/40 lg:grid-cols-[4fr_8fr]">
          {/* Explore Promotions — text only (additional left column) */}
          <div className="flex flex-col justify-between gap-6 border-b border-sf-border/40 p-4 lg:border-b-0">
            <div className="flex flex-col gap-4">
              <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                What&apos;s On Offer
              </h3>
              <p className="mb-5 font-inter leading-relaxed">
                Limited offers, seasonal specials, and perks worth knowing about. Keep an eye on
                what&apos;s currently available across SwillFam venues and make the most of your
                next visit.
              </p>
            </div>
            <SpecularButton href="/promotions" size="lg" radius={30} className="w-fit">
              View Promotions
            </SpecularButton>
          </div>

          {/* Private Events — text + image (PrivateEventsSection pattern) */}
          <div className="flex flex-col gap-8 p-4 sm:flex-row lg:border-l lg:border-sf-border/40">
            <div className="flex flex-1 flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                  Host Your Moments
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
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden border border-sf-border/30 sm:w-[400px]">
              <ParallaxImage>
                <Image
                  src="/merchandise/private-event.png"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </ParallaxImage>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
