import { Container } from "@/components/shared/Container";

export function PromotionsIntro() {
  return (
    <section className="py-16 lg:py-20">
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-4">
          <span className="font-inter text-sm uppercase tracking-widest text-white">Our Promotions</span>
          <h2 className="font-syne text-[clamp(2rem,4vw,48px)] leading-tight text-white">
            Find Offers Made for Every Kind of Plan
          </h2>
        </div>
        <div className="flex flex-col gap-5">
          <p className="font-inter leading-relaxed text-white">
            SwillFam promotions are created for different moments, whether you are planning dinner,
            drinks with friends, a casual gathering, or a full night out. Each promotion is designed
            to make your experience more exciting, accessible, and worth coming back for.
          </p>
          <p className="font-inter leading-relaxed text-white">
            Browse available offers by venue or category, check the valid dates, and choose the
            promotion that fits your next SwillFam moment.
          </p>
        </div>
      </Container>
    </section>
  );
}
