import { Container } from "@/components/shared/Container";

export function TalentsIntro() {
  return (
    <section className="py-16 lg:py-20">
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-4">
          <span className="font-inter text-sm uppercase tracking-widest text-white">Our Talents</span>
          <p className="max-w-2xl font-inter text-lg leading-relaxed text-white md:text-2xl">
            From resident DJs to the chefs and bartenders shaping every plate and pour, meet the
            people who bring the SwillFam experience to life.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <p className="font-inter leading-relaxed">
            Behind every unforgettable night, great dish, signature drink, and memorable event is a
            team of talents who understand how to create atmosphere. SwillFam talents bring their
            own style, skill, and personality into each venue, making every experience feel alive
            and distinct.
          </p>
          <p className="font-inter leading-relaxed">
            Whether they&apos;re behind the decks, behind the bar, in the kitchen, or on the floor,
            each talent plays a role in shaping the moments guests remember.
          </p>
        </div>
      </Container>
    </section>
  );
}
