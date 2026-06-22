import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";

const POSTERS = ["/home/poster-1.png", "/home/poster-2.png", "/home/poster-3.png"];

/** Upcoming Events (Figma 302:15) — left intro column + right poster row. */
export function UpcomingEvents() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div className="flex max-w-[560px] flex-col gap-6">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-sf-text">
            Upcoming Events
          </h2>
          <p className="font-inter text-base leading-relaxed text-white/70 md:text-lg">
            Stay updated with upcoming events, special programs, parties, collaborations, and
            community gatherings happening across Swillfam&rsquo;s network.
          </p>
          <Button asChild variant="pill" size="pill" className="w-fit">
            <Link href="#">See all events</Link>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {POSTERS.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[290/516] overflow-hidden bg-sf-surface"
            >
              <Image
                src={src}
                alt={`Upcoming event ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 30vw, 290px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
