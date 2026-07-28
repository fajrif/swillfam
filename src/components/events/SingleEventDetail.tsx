import { Container } from "@/components/shared/Container";
import { ZoomableImage } from "@/components/shared/ZoomableImage";
import { PastEventStamp } from "./PastEventStamp";
import { ReserveButton } from "./ReserveButton";
import { EVENT_PROSE } from "./prose";

/**
 * Top block of a one-off (`FIXED`) event: the name at large scale beside its
 * poster, with the "About This Event" write-up, the schedule facts, and the
 * reserve CTA.
 */
export function SingleEventDetail({
  name,
  description,
  poster,
  categoryName,
  venueName,
  dateLabel,
  timeLabel,
  phone,
  active,
}: {
  name: string;
  /** Rich-text HTML from the admin editor. */
  description: string;
  poster: string | null;
  categoryName: string | null;
  venueName: string | null;
  dateLabel: string;
  timeLabel: string;
  phone?: string | null;
  active: boolean;
}) {
  return (
    <section className="py-16 lg:py-20">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <div className="flex flex-col items-start gap-5">
          {!active && <PastEventStamp />}
          <h1 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            {name}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {poster ? (
            <div className="relative aspect-[4/4] w-full overflow-hidden bg-sf-surface">
              <ZoomableImage
                src={poster}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className="font-syne text-xl font-bold text-white">About This Event</h2>
              <div className={EVENT_PROSE} dangerouslySetInnerHTML={{ __html: description }} />
            </div>

            <dl className="flex flex-col gap-1 font-inter text-white mb-5">
              {categoryName ? (
                <div className="flex gap-2">
                  <dt className="font-semibold">Category:</dt>
                  <dd>{categoryName}</dd>
                </div>
              ) : null}
              {venueName ? (
                <div className="flex gap-2">
                  <dt className="font-semibold">Venue:</dt>
                  <dd>{venueName}</dd>
                </div>
              ) : null}
              <div className="flex gap-2">
                <dt className="font-semibold">Date:</dt>
                <dd>{dateLabel}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold">Time:</dt>
                <dd>{timeLabel}</dd>
              </div>
            </dl>

            <ReserveButton
              eventName={name}
              venueName={venueName}
              phone={phone}
              active={active}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
