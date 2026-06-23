import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { ApplicationForm } from "./ApplicationForm";

/** "Apply Now" — application form (left) + venue image (right). */
export function ApplyNowSection({ careers }: { careers: { id: string; jobTitle: string }[] }) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <ApplicationForm careers={careers} />
        </div>

        <div className="relative aspect-[680/794] w-full overflow-hidden border border-sf-border/30">
          <Image
            src="/careers/application-form.png"
            alt="Inside a SwillFam venue"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
