import { Container } from "@/components/shared/Container";
import { PlasmaBackground } from "@/components/reactbits/PlasmaBackground";

export function HeroSection() {
  return (
    <div className="relative h-[715px] w-full overflow-hidden">
      {/* Animated plasma background (matches the homepage hero) */}
      <PlasmaBackground
        className="absolute inset-0"
        color="#c6387f"
        speed={0.2}
        direction="pingpong"
        scale={2.3}
        opacity={0.8}
      />
      <div className="absolute inset-x-0 bottom-0 h-[225px] bg-gradient-to-t from-sf-bg to-transparent" />
      <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
        <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
          Creating Jakarta&apos;s Most Memorable Nights
        </h1>
      </Container>
    </div>
  );
}
