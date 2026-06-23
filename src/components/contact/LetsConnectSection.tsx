import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { ContactForm } from "./ContactForm";

/** "Let's Connect" — venue image (left) + inquiry form (right). */
export function LetsConnectSection() {
  return (
    <section>
      <Container className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2">
        <div className="relative aspect-[683/740] w-full overflow-hidden border border-sf-border/30">
          <Image
            src="/contact/contact-us.png"
            alt="Inside a SwillFam venue"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
