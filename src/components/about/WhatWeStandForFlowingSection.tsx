import { Container } from "@/components/shared/Container";
import { FlowingMenu } from "@/components/reactbits/FlowingMenu";

const FLOWING_ITEMS = [
  { link: "#", text: "Experience", image: "", description: "Every SwillFam venue is built around how it makes guests feel, not just what it looks like." },
  { link: "#", text: "Innovation", image: "", description: "We treat every new concept as a chance to push past what's already been done, rather than repeat it." },
  { link: "#", text: "Culture", image: "", description: "Our venues are shaped by the people, music, and moments that define Jakarta's evolving identity." },
  { link: "#", text: "Quality", image: "", description: "Every detail, from the menu to the room, is held to a standard that doesn't get compromised." },
  { link: "#", text: "Growth", image: "", description: "We expand only when a new concept has something genuinely different to offer, not just to grow bigger." },
];

export function WhatWeStandForFlowingSection() {
  return (
    <section className="border-t border-sf-border/60 py-16 lg:py-24">
      <Container>
        <h2 className="text-center font-syne text-[clamp(2rem,5vw,64px)] leading-[1.1] text-white">
          What We Stand For:
        </h2>
      </Container>

      <div className="mt-12 h-[450px] lg:h-[600px]">
        <FlowingMenu
          items={FLOWING_ITEMS}
          bgColor="transparent"
          textColor="#fff"
          marqueeBgColor="#ff0055"
          marqueeTextColor="#fff"
          borderColor="rgba(255,255,255,0.4)"
        />
      </div>
    </section>
  );
}
