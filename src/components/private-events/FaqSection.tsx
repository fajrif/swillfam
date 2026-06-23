"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/shared/Container";
import { FAQS } from "./data";

/** "Frequently Asked Questions" — title (left) + collapsible list (right). */
export function FaqSection() {
  return (
    <section className="py-16">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="flex flex-col">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-b border-sf-border/50 last:border-b-0"
            >
              <AccordionTrigger className="font-syne text-lg text-white hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-inter text-sm leading-relaxed text-white">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
