import { Container } from "@/components/shared/Container";
import { FlowingMenu } from "@/components/reactbits/FlowingMenu";

const FLOWING_ITEMS = [
  { link: "#", text: "Experience", image: "/about/stand-for-1.jpg" },
  { link: "#", text: "Innovation", image: "/about/stand-for-2.jpg" },
  { link: "#", text: "Culture", image: "/about/stand-for-3.jpg" },
  { link: "#", text: "Quality", image: "/about/stand-for-4.jpg" },
  { link: "#", text: "Growth", image: "/about/stand-for-5.jpg" },
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
