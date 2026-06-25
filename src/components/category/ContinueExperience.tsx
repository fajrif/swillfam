import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

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
            <div className="relative aspect-[382/522] w-full shrink-0 overflow-hidden sm:w-[300px]">
              <Image
                src="/image1.png"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                  Continue the Experience
                </h3>
                <p className="font-inter leading-relaxed text-white">
                  There is more to discover across the SwillFam world. Explore our experiences,
                  upcoming events, and private event offerings to find the right moment for your next
                  visit, celebration, or gathering.
                </p>
              </div>
              <Button asChild variant="swillfam" size="pill" className="w-fit">
                <Link href="/experience">Discover Experiences</Link>
              </Button>
            </div>
          </div>

          {/* Explore Events — text only */}
          <div className="flex flex-col justify-between gap-6 p-4 lg:border-l lg:border-sf-border/40">
            <div className="flex flex-col gap-4">
              <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                Explore Events
              </h3>
              <p className="font-inter leading-relaxed text-white">
                Explore upcoming lifestyle and nightlife events happening across SwillFam venues,
                from relaxed gatherings and social meetups to high-energy nights, live entertainment,
                and special experiences designed to bring people together.
              </p>
            </div>
            <Button asChild variant="swillfam" size="pill" className="w-fit">
              <Link href="/events">View Events</Link>
            </Button>
          </div>
        </div>

        {/* Row 2 — [4fr_8fr] */}
        <div className="grid border border-sf-border/40 lg:grid-cols-[4fr_8fr]">
          {/* Explore Promotions — text only (additional left column) */}
          <div className="flex flex-col justify-between gap-6 border-b border-sf-border/40 p-4 lg:border-b-0">
            <div className="flex flex-col gap-4">
              <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                Explore Promotions
              </h3>
              <p className="font-inter leading-relaxed text-white">
                SwillFam promotions bring the latest offers, specials, and venue deals together in
                one place, making it easier to enjoy food, drinks, events, and nightlife experiences
                across the SwillFam world.
              </p>
            </div>
            <Button asChild variant="swillfam" size="pill" className="w-fit">
              <Link href="/promotions">View Promotions</Link>
            </Button>
          </div>

          {/* Private Events — text + image (PrivateEventsSection pattern) */}
          <div className="grid gap-8 p-4 lg:grid-cols-[7fr_5fr] lg:border-l lg:border-sf-border/40">
            <div className="flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <h3 className="font-syne text-[clamp(1.75rem,3vw,40px)] leading-tight text-white">
                  Private Events at SwillFam
                </h3>
                <p className="font-inter leading-relaxed text-white">
                  Plan your next corporate gathering, birthday, wedding, brand activation, or private
                  celebration with SwillFam. With flexible venues, curated food and beverage options,
                  and dedicated event support, our team helps create seamless experiences tailored to
                  your guests, goals, and occasion.
                </p>
              </div>
              <Button asChild variant="swillfam" size="pill" className="w-fit">
                <Link href="/private-events">Plan Private Events</Link>
              </Button>
            </div>
            <div className="relative aspect-[382/522] w-full overflow-hidden border border-sf-border/30">
              <Image
                src="/merchandise/private-event.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
