import { Container } from "@/components/shared/Container";
import { FlowingMenu } from "@/components/reactbits/FlowingMenu";

const FLOWING_ITEMS = [
  { link: "#", text: "Experience", image: "", description: "SwillFam is built around culture, connection, and shared experiences. Through food, drinks, music, venues, and events, SwillFam creates spaces where people come together, express themselves, and become part of the city’s lifestyle scene.", },
  { link: "#", text: "Innovation", image: "", description: "SwillFam is built around culture, connection, and shared experiences. Through food, drinks, music, venues, and events, SwillFam creates spaces where people come together, express themselves, and become part of the city’s lifestyle scene.", },
  { link: "#", text: "Culture", image: "", description: "SwillFam is built around culture, connection, and shared experiences. Through food, drinks, music, venues, and events, SwillFam creates spaces where people come together, express themselves, and become part of the city’s lifestyle scene.", },
  { link: "#", text: "Quality", image: "", description: "SwillFam is built around culture, connection, and shared experiences. Through food, drinks, music, venues, and events, SwillFam creates spaces where people come together, express themselves, and become part of the city’s lifestyle scene.", },
  { link: "#", text: "Growth", image: "", description: "SwillFam is built around culture, connection, and shared experiences. Through food, drinks, music, venues, and events, SwillFam creates spaces where people come together, express themselves, and become part of the city’s lifestyle scene.", },
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
