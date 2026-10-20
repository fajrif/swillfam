import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { VideoSource } from "@/lib/video";
import { EventRecapVideo } from "./EventRecapVideo";

/**
 * Anchor the past-event CTA scrolls to.
 *
 * The page puts it on whichever recap block it renders first — the video
 * section, or the photo carousel when there is no video — so "Watch the Recap"
 * always lands on something.
 */
export const RECAP_ANCHOR = "recap";

/**
 * "Watch the Recap" — the recap video, its length, and nothing else.
 *
 * Titled distinctly from the photo carousel below it ("Event Recap"), which can
 * appear on the same page: two sections sharing a heading would read as a
 * duplicate rather than as video-then-photos.
 */
export function EventRecapSection({
  source,
  thumbnail,
  eventName,
  durationLabel,
}: {
  source: VideoSource;
  thumbnail: string | null;
  eventName: string;
  /** "2:15", derived from the stored ISO duration; "" when none is set. */
  durationLabel: string;
}) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-10">
        <SectionHeading
          align="center"
          title="Watch the Recap"
          lead={`The night itself — ${eventName}, as it happened.`}
        />

        <div className="flex w-full max-w-[960px] flex-col gap-3">
          <EventRecapVideo source={source} thumbnail={thumbnail} eventName={eventName} />
          {durationLabel ? (
            <p className="font-inter text-sm">Running time {durationLabel}</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
