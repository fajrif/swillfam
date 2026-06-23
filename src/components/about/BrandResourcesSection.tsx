import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { BRAND_RESOURCES } from "./data";

export function BrandResourcesSection() {
  return (
    <section className="border-t border-sf-border/60 py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          Brand Resources &amp; Media Downloads
        </h2>

        <div className="flex flex-col">
          <p className="mb-10 font-inter leading-relaxed text-white">
            Access official SwillFam brand assets for media, partners, collaborators, and event
            organizers. Download approved logos, brand guidelines, venue imagery, press kits, and
            other resources for editorial and promotional use.
          </p>

          {BRAND_RESOURCES.map((label, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-t border-sf-border/50 py-6 last:border-b"
            >
              <span className="font-syne text-2xl text-white">{label}</span>
              <Button asChild variant="pill-outline" size="pill">
                <Link href="#">Download Here</Link>
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
