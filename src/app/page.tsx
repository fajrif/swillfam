import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ClientsMarquee } from "@/components/landing/ClientsMarquee";
import { Features } from "@/components/landing/Features";
import { Infrastructure } from "@/components/landing/Infrastructure";
import { Pricing } from "@/components/landing/Pricing";
import { Cta } from "@/components/landing/Cta";
import { Footer } from "@/components/landing/Footer";
import { ScrollEffects } from "@/components/landing/ScrollEffects";

export default function Home() {
  return (
    <>
      <ScrollEffects />
      <Navbar />
      <main className="pt-20">
        <Hero />
        <ClientsMarquee />
        <Features />
        <Infrastructure />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
