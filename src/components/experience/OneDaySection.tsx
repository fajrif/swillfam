import { Container } from "@/components/shared/Container";

/** Intro: eyebrow + big title (left) + description (right). */
export function OneDaySection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="font-inter text-lg font-thin text-white">Your Day, Our Way</p>
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            Every Hour, A Different Mood
          </h2>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <p className="font-inter leading-relaxed">
            The SwillFam Experience is designed as a journey through the city, where each part of the
            day connects to a different venue, mood, and moment. Mornings might start slow, an easy
            coffee or a quiet breakfast before the day picks up pace. By afternoon, lunch becomes a
            chance to reconnect with friends or colleagues over a menu built for the moment. As
            evening sets in, dinner takes on a different rhythm, one meant for lingering, for good
            conversation, for settling into the night ahead. And when the city shifts into late-night
            mode, SwillFam&apos;s nightlife venues take over, offering energy, music, and atmosphere
            built for those who want the night to keep going.
          </p>
          <p className="font-inter leading-relaxed">
            Wherever you are in the day, there&apos;s a venue shaped around it, giving guests a
            simple way to explore where to go, what to do, and how to plan their next visit, one hour
            at a time.
          </p>
        </div>
      </Container>
    </section>
  );
}
