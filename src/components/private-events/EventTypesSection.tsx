import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { EVENT_TYPES, type EventType } from "./data";

/** "Event Types:" — 2-col grid of tiles; hover reveals the description. */
export function EventTypesSection() {
  return (
    <section>
      <Container className="flex flex-col gap-12">
        <h2 className="text-center font-syne text-[clamp(2rem,5vw,56px)] leading-[1.05] text-white">
          Event Types:
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {EVENT_TYPES.map((type) => (
            <EventTypeCard
              key={type.key}
              img={type.img}
              title={type.title}
              description={type.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function EventTypeCard({ img, title, description }: Omit<EventType, "key">) {
  return (
    <div className="group relative aspect-[683/520] w-full overflow-hidden border border-sf-border/40">
      <Image
        src={img}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Subtle constant overlay so the centered title stays legible */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Title — centered, hidden on hover */}
      <h3 className="absolute inset-0 flex items-center justify-center p-6 text-center font-syne font-bold text-[clamp(1.5rem,2.5vw,32px)] leading-tight text-white transition-opacity duration-300 group-hover:opacity-0">
        {title}
      </h3>

      {/* Hover overlay: dark wash + inset bordered box with title + description */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-5 flex flex-col justify-between gap-8 bg-black/75 border border-white/15 px-10 py-16 text-center">
          <h3 className="font-syne font-bold text-[clamp(1.5rem,2.5vw,32px)] leading-tight text-white">
            {title}
          </h3>
          <p className="font-inter text-medium leading-relaxed text-white">{description}</p>
        </div>
      </div>
    </div>
  );
}
