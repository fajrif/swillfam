import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { EVENTS } from "./data";

/** "What's Happening This Week" — centered heading + 3-col event cards. */
export function WhatsHappeningSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-12">
        <div className="mx-auto flex max-w-[640px] flex-col gap-4 text-center">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            What&apos;s Happening This Week
          </h2>
          <p className="font-inter leading-relaxed text-white">
            Explore upcoming events across SwillFam venues and see what is happening this week. From
            dining experiences and regular programs to music nights and special events, there is
            always something to discover.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {EVENTS.map((event, i) => (
            <article key={i} className="flex flex-col gap-4 border border-sf-border/50 p-4">
              <h3 className="font-syne text-2xl text-white">{event.name}</h3>
              <div className="relative aspect-[406/334] w-full overflow-hidden bg-sf-surface">
                <Image
                  src={event.img}
                  alt={event.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <span className="font-syne text-sm text-white">{event.venue}</span>
                  <span className="font-inter text-xs text-white">{event.date}</span>
                </div>
              </div>
              <p className="font-inter text-sm leading-relaxed text-white">{event.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
