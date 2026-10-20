import type { Talent, Venue } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { ContentImage } from "@/components/shared/ContentImage";

type TalentWithVenue = Talent & { venue: Venue | null };

/** Top of the single-talent page: photo (left) + name/role/home-venue + bio (right). */
export function TalentDetailIntro({ talent }: { talent: TalentWithVenue }) {
  return (
    <section className="pt-8 pb-16 lg:pt-12">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-sf-surface">
          {talent.image ? (
            <ContentImage
              src={talent.image}
              alt={talent.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-sf-surface" />
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* This page had no heading at all before: the talent's name appeared
              only as a "Name:" row in the list below, so the one page about
              this person never said whose page it was — while `talentGraph`
              published a `Person` node naming them. The row is gone because
              the heading now carries it; repeating it would just be the same
              string twice. */}
          <h1 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            {talent.name}
          </h1>

          <div className="flex flex-col gap-1 font-inter text-lg">
            <p>
              <span className="font-semibold text-white">Role:</span> {talent.speciality}
            </p>
            {talent.venue ? (
              <p>
                <span className="font-semibold text-white">Home Venue:</span> {talent.venue.name}
              </p>
            ) : null}
          </div>

          <p className="whitespace-pre-line font-inter leading-relaxed">
            {talent.description}
          </p>
        </div>
      </Container>
    </section>
  );
}
