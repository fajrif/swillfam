import { Container } from "@/components/shared/Container";

export function BrandResourcesSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          Brand Resources &amp; Media Downloads
        </h2>

        <p className="font-inter leading-relaxed">
          Access official SwillFam brand assets for media, partners, collaborators, and event
          organizers. Download approved logos, brand guidelines, venue imagery, press kits, and
          other resources for editorial and promotional use.
        </p>
      </Container>
    </section>
  );
}
