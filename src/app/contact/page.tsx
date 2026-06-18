import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ScrollEffects } from "@/components/landing/ScrollEffects";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Laci POS",
  description: "Tell us about your business and we'll help you find the right Laci POS package.",
};

export default function ContactPage() {
  return (
    <>
      <ScrollEffects />
      <Navbar active="contact" />
      <main className="pt-20">
        <div className="grid-bg relative border-x-2 border-brand-black max-w-7xl mx-auto bg-white shadow-brutal overflow-hidden">
          <ContactHero />
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
