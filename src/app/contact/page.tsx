import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Swillfam",
  description: "Tell us about your business and we'll help you find the right Swillfam package.",
};

export default function ContactPage() {
  return (
    <main className="pt-20">
      <div className="grid-bg relative border-x-2 border-brand-black max-w-7xl mx-auto bg-white shadow-brutal overflow-hidden">
        <ContactHero />
        <ContactForm />
      </div>
    </main>
  );
}
