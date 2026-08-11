import { Container } from "@/components/shared/Container";
import { ZoomableImage } from "@/components/shared/ZoomableImage";
import { PastEventStamp } from "./PastEventStamp";
import { ReserveButton } from "./ReserveButton";
import { EVENT_PROSE } from "./prose";

/**
 * The two body blocks of a recurring (series) event.
 *
 * "Next Edition Event" leads with the short description and the next computed
 * date; "About This Series Event" carries the full rich-text write-up — which is
 * also where an admin notes per-edition details like special guests or talents —
 * plus the recurring day, venue, and category.
 */
export function RecurringEventDetail({
  name,
  shortDescription,
  description,
  image,
  dayLabel,
  nextDateLabel,
  venueName,
  categoryName,
  phone,
  active,
}: {
  name: string;
  shortDescription: string;
  /** Rich-text HTML from the admin editor. */
  description: string;
  image: string | null;
  /** e.g. "Every Fri, Sat". */
  dayLabel: string;
  /** e.g. "Saturday, 1 August 2026 – 7:00 PM"; null when no weekday is set. */
  nextDateLabel: string | null;
  venueName: string | null;
  categoryName: string | null;
  phone?: string | null;
  active: boolean;
}) {
  return (
    <>
      {/* Next Edition Event */}
      <section className="py-16 lg:py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-start gap-5">
            {!active && <PastEventStamp />}
            <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
              Next Edition Event
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            <p className="whitespace-pre-line font-inter leading-relaxed">
              {shortDescription}
            </p>

            {nextDateLabel ? (
              <dl className="flex flex-col gap-1 font-inter">
                <div className="flex gap-2">
                  <dt className="font-semibold text-white">Next Date &amp; Time:</dt>
                  <dd>{nextDateLabel}</dd>
                </div>
              </dl>
            ) : null}

            <ReserveButton
              eventName={name}
              venueName={venueName}
              phone={phone}
              active={active}
            />
          </div>
        </Container>
      </section>

      {/* About This Series Event */}
      <section className="py-16 lg:py-20">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-6">
            <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
              About This Series Event
            </h2>

            <div className={EVENT_PROSE} dangerouslySetInnerHTML={{ __html: description }} />

            <dl className="flex flex-col gap-1 font-inter">
              <div className="flex gap-2">
                <dt className="font-semibold text-white">Day:</dt>
                <dd>{dayLabel}</dd>
              </div>
              {venueName ? (
                <div className="flex gap-2">
                  <dt className="font-semibold text-white">Venue:</dt>
                  <dd>{venueName}</dd>
                </div>
              ) : null}
              {categoryName ? (
                <div className="flex gap-2">
                  <dt className="font-semibold text-white">Category:</dt>
                  <dd>{categoryName}</dd>
                </div>
              ) : null}
            </dl>

            <ReserveButton
              eventName={name}
              venueName={venueName}
              phone={phone}
              active={active}
            />
          </div>

          {image ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-sf-surface">
              <ZoomableImage
                src={image}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </Container>
      </section>
    </>
  );
}
