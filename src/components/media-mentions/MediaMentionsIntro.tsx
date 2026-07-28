import { Container } from "@/components/shared/Container";

export function MediaMentionsIntro() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="font-inter text-lg font-thin text-white">Press & Coverage</p>
          <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
            SwillFam in the Press
          </h2>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <p className="font-inter leading-relaxed text-white">
            From venue features and event highlights to lifestyle stories and nightlife coverage,
            SwillFam&rsquo;s media mentions capture how our venues and experiences continue to be
            seen across the city&rsquo;s cultural scene.
          </p>
          <p className="font-inter leading-relaxed text-white">
            Browse past articles, interviews, features, and external links to discover how SwillFam
            has been covered by media partners and publications over time.
          </p>
        </div>
      </Container>
    </section>
  );
}
