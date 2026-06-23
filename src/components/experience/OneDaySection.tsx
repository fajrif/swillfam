import { Container } from "@/components/shared/Container";

/** Intro: eyebrow + big title (left) + description (right). */
export function OneDaySection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="font-inter text-lg font-thin text-white">Your Day, Our Way</p>
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            One Day, Different Ways to Experience SwillFam
          </h2>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <p className="font-inter leading-relaxed text-white">
            The SwillFam Experience is designed as a journey through the city. Each part of the day
            connects to a different venue, mood, and moment, giving guests a simple way to explore
            where to go, what to do, and how to plan their next visit.
          </p>
          <p className="font-inter leading-relaxed text-white">
            Whether you are starting slow, meeting friends for lunch, setting the tone with dinner,
            or heading into a late-night event, SwillFam offers a venue for every kind of plan.
          </p>
        </div>
      </Container>
    </section>
  );
}
