import { Container } from "@/components/shared/Container";

/** Intro: big title (left) + description (right). */
export function BePartSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          Be Part of the SwillFam Experience
        </h2>
        <p className="font-inter leading-relaxed text-white">
          Explore available roles across SwillFam and our venues. Each position includes details
          about the department or venue, key responsibilities, qualifications, and application
          requirements. Browse current opportunities to find a role that matches your skills and
          experience, and take the next step toward joining the SwillFam team.
        </p>
      </Container>
    </section>
  );
}
