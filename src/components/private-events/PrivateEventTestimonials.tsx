import type { PrivateEventTestimonial } from "@/generated/prisma/client";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

/** "Trusted for Private Moments" — a row of quote cards for one private event. */
export function PrivateEventTestimonials({
  title,
  lead,
  testimonials,
}: {
  title: string;
  lead?: string;
  testimonials: PrivateEventTestimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-12">
        <SectionHeading align="center" title={title} lead={lead} />

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex flex-col items-center justify-center gap-6 border border-sf-border/50 bg-sf-surface px-8 py-12 text-center"
            >
              <blockquote className="font-inter leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="font-inter text-lg text-white">{testimonial.author}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
