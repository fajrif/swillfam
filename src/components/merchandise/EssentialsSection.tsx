import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

/** Centered intro for the merchandise grid (Figma "SwillFam Essentials"). */
export function EssentialsSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          SwillFam Essentials
        </h2>
        <p className="max-w-[640px] font-inter leading-relaxed text-white">
          SwillFam merchandise is made for those who live the scene beyond the venue. Explore
          selected pieces inspired by our venues, events, and lifestyle culture. All merchandise are
          available at our venues or kindly DM us to order.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="pill-outline" size="pill">
            <Link href="#">DM on Instagram</Link>
          </Button>
          <Button asChild variant="pill-outline" size="pill">
            <Link href="#">Inquire via WhatsApp</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
