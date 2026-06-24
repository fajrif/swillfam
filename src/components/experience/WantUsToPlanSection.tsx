import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import type { SiteSettings } from "@/lib/site-settings";

export function WantUsToPlanSection({ settings }: { settings: SiteSettings }) {
  const wa = settings.mainWhatsapp ? `https://wa.me/${settings.mainWhatsapp.replace(/[^0-9]/g, "")}` : "#";

  return (
    <section className="pt-8 pb-16">
      <Container>
        <div className="grid gap-8 p-4 border border-sf-border/40 lg:grid-cols-[7fr_5fr]">
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
                Want Us to Plan It for You?
              </h2>
              <p className="font-inter leading-relaxed text-white">
                Not sure where to start? Tell us your preferred vibe, group size, date, and
                occasion, and our team can help guide you to the right SwillFam venues for your day
                or night out.
              </p>
              <p className="font-inter leading-relaxed text-white">
                From dinner reservations to pre-drinks, nightlife plans, and private celebrations, we
                can help you plan a route that fits your mood.
              </p>
            </div>
            <Button asChild variant="swillfam" size="pill" className="w-fit">
              <Link href={wa}>Plan via WhatsApp</Link>
            </Button>
          </div>

          <div className="relative aspect-[680/581] w-full overflow-hidden border border-sf-border/30">
            <Image
              src="/experience/plan-for-event.png"
              alt="Plan your SwillFam experience"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
