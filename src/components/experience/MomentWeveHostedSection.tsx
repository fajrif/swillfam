import { Container } from "@/components/shared/Container";
import { MomentJourneyTrack, type MomentStep } from "./MomentJourneyTrack";

// Static for now — the CTAs are deliberate placeholders with no destination yet,
// so there's nothing to model in the database.
const MOMENT_STEPS: MomentStep[] = [
  {
    period: "Morning",
    tagline: "Start Your Day",
    title: "Kilo Padel Cafe [Coming Soon]",
    time: "9:00 AM – 12:00 PM",
    tags: "Padel, brunch, coffee",
    cta: "Reserve Now",
    image: "/experience/plan-1.png",
  },
  {
    period: "Afternoon",
    tagline: "Long Lunch",
    title: "Atsumaru Izakaya",
    time: "12:30 PM – 3:00 PM",
    tags: "Japanese dining, sake, sharing plates",
    cta: "Reserve Now",
    image: "/experience/plan-2.png",
  },
  {
    period: "Dinner",
    tagline: "Set the Tone",
    title: "Kilo Jakarta",
    time: "7:00 PM – 9:30 PM",
    tags: "Dinner, cocktails, group dining",
    cta: "Reserve Now",
    image: "/experience/plan-3.png",
  },
  {
    period: "After Dinner",
    tagline: "Ease Into the Night",
    title: "Dualism / Bar Truce",
    time: "9:30 PM – 12:00 AM",
    tags: "Cocktails, lounge, pre-game drinks",
    cta: "Reserve Now",
    image: "/experience/plan-4.png",
  },
  {
    period: "Night",
    tagline: "The Main Event",
    title: "Swillhouse / Le Cirque / Zoo",
    time: "12:00 AM onwards",
    tags: "Nightlife, live DJs, bottle service, dancing",
    cta: "Reserve Now",
    image: "/experience/plan-5.png",
  },
];

/** Day→night journey: five steps threaded onto a scroll-driven serpentine. */
export function MomentWeveHostedSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <h2 className="text-center font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          The Day, Mapped Out
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-center font-inter leading-relaxed">
          A visual look at how one day moves through SwillFam, from the first coffee to the last
          call, and every venue in between.
        </p>

        <MomentJourneyTrack steps={MOMENT_STEPS} />
      </Container>
    </section>
  );
}
