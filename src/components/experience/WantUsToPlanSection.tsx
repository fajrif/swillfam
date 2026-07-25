import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import type { SiteSettings } from "@/lib/site-settings";

export function WantUsToPlanSection({ settings }: { settings: SiteSettings }) {
  const wa = settings.mainWhatsapp ? `https://wa.me/${settings.mainWhatsapp.replace(/[^0-9]/g, "")}` : "#";

  return (
    <section className="pt-8 pb-16">
      <Container>
        <div className="grid gap-8 p-4 lg:grid-cols-[1fr_1fr]">
          <div className="order-2 flex flex-col justify-between lg:order-1">
            <div className="flex flex-col gap-6">
              <h2 className="font-syne text-[clamp(2.5rem,5vw,64px)] leading-tight text-white">
                Want Us to Plan It for You?
              </h2>
              <p className="font-inter leading-relaxed text-white">
                Not sure where to start? Tell us your preferred vibe, group size, date, and
                occasion, and our team can help guide you to the right SwillFam venues for your day
                or night out.
              </p>
              <p className="mb-5 font-inter leading-relaxed text-white">
                From dinner reservations to pre-drinks, nightlife plans, and private celebrations, we
                can help you plan a route that fits your mood.
              </p>
            </div>
            <SpecularButton href={wa} target="_blank" rel="noopener noreferrer" size="lg" radius={30} className="w-fit">
              Plan via WhatsApp
            </SpecularButton>
          </div>

          <div className="order-1 relative aspect-[680/581] w-full overflow-hidden border border-sf-border/30 lg:order-2">
            <ParallaxImage>
              <Image
                src="/experience/plan-for-event.png"
                alt="Plan your SwillFam experience"
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
