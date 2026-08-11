import Image from "next/image";
import Link from "next/link";
import type { PrivateEvent } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";

const FALLBACK = "/private-events/Mask group.png";

/** "Event Types:" — 2-col grid of tiles; hover reveals the description. */
export function EventTypesSection({ privateEvents }: { privateEvents: PrivateEvent[] }) {
  if (privateEvents.length === 0) return null;

  return (
    <section>
      <Container className="flex flex-col gap-12">
        <h2 className="text-center font-syne text-[clamp(2rem,5vw,56px)] leading-[1.05] text-white">
          Event Types:
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {privateEvents.map((privateEvent) => (
            <EventTypeCard key={privateEvent.id} privateEvent={privateEvent} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function EventTypeCard({ privateEvent }: { privateEvent: PrivateEvent }) {
  const { title, shortDescription } = privateEvent;

  return (
    <Link
      href={`/private-events/${privateEvent.slug}`}
      className="group relative block aspect-[683/520] w-full overflow-hidden border border-sf-border/40"
    >
      <Image
        src={privateEvent.image ?? privateEvent.bannerImage ?? FALLBACK}
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
          <p className="font-inter text-medium leading-relaxed">{shortDescription}</p>
        </div>
      </div>
    </Link>
  );
}
