"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/shared/Container";
import type { Faq } from "@/generated/prisma/client";

/** "Frequently Asked Questions" — title (left) + collapsible list (right). */
export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="py-16">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <h2 className="font-syne text-[clamp(2.25rem,5vw,64px)] leading-[1.05] text-white">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border border-sf-border/60 px-8"
            >
              <AccordionTrigger className="items-center gap-6 py-7 font-syne text-xl font-bold text-white hover:no-underline [&>svg]:hidden [&[data-state=open]_i]:rotate-90">
                {faq.question}
                <i
                  className="ph ph-play shrink-0 text-2xl text-white/40 transition-transform duration-200"
                  aria-hidden
                />
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-7 font-inter text-sm leading-relaxed text-white">
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
