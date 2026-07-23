import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { VENUE_CONTACTS } from "./data";

/** "Contact Our Venues Directly" — intro column + a list of venue contact rows. */
export function ContactVenuesSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: intro */}
        <div className="flex max-w-[460px] flex-col gap-6">
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            Contact Our Venues Directly
          </h2>
          <p className="font-inter leading-relaxed text-white">
            Looking to make a reservation or ask about a specific outlet? Choose the SwillFam venue
            you want to contact and connect directly through its WhatsApp or location details.
          </p>
        </div>

        {/* Right: venue rows */}
        <div className="flex flex-col gap-4">
          {VENUE_CONTACTS.map((venue) => (
            <div
              key={venue.name}
              className="group flex items-center gap-5 border border-sf-border/50 transition-colors duration-300 hover:border-white/80"
            >
              <div className="relative aspect-[140/96] w-[140px] shrink-0 overflow-hidden bg-sf-surface">
                <Image
                  src={venue.img}
                  alt={venue.name}
                  fill
                  sizes="140px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Link href={`/venues/${venue.slug}`} className="w-fit">
                  <h3 className="font-syne text-2xl leading-tight text-white transition-colors duration-300 group-hover:text-sf-accent">
                    {venue.name}
                  </h3>
                </Link>
                <p className="font-inter text-sm text-white">WhatsApp: {venue.whatsapp}</p>
                <p className="font-inter text-sm text-white">
                  Location:{" "}
                  <Link href={venue.mapHref} className="transition-colors text-white/50 hover:text-sf-accent">
                    View on Map
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
