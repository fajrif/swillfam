import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { ReserveButton } from "./ReserveButton";

const DEFAULT_COPY =
  "For ticketed events, secure your place by purchasing your ticket through the official ticketing platform as early as possible. Popular SwillFam events can reach capacity quickly, especially for special performances and limited-capacity experiences.";

/**
 * "Get Your Tickets" — ticketing copy beside event imagery, with the reserve CTA
 * and, when the event has a `ticketLink`, a direct link to the ticket page.
 * The caller skips this section when the event has neither ticket info nor link.
 */
export function EventTicketsSection({
  image,
  ticketInfo,
  ticketLink,
  eventName,
  venueName,
  phone,
  active,
}: {
  image: string | null;
  ticketInfo: string | null;
  ticketLink: string | null;
  eventName: string;
  venueName?: string | null;
  phone?: string | null;
  active: boolean;
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {image ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-sf-surface">
            <Image
              src={image}
              alt={eventName}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-6">
          <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
            Get Your Tickets
          </h2>
          <p className="whitespace-pre-line font-inter leading-relaxed">
            {ticketInfo ?? DEFAULT_COPY}
          </p>

          <div className="flex flex-wrap items-start gap-4">
            <ReserveButton
              eventName={eventName}
              venueName={venueName}
              phone={phone}
              active={active}
            />
            {ticketLink && active ? (
              <SpecularButton
                href={ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                radius={30}
                className="w-fit"
              >
                Buy Tickets
              </SpecularButton>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
