import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ScrollEffects } from "@/components/landing/ScrollEffects";
import { Ticker } from "@/components/features/Ticker";
import { FeaturesHero } from "@/components/features/FeaturesHero";
import { FeatureModule } from "@/components/features/FeatureModule";
import { FeaturesCta } from "@/components/features/FeaturesCta";
import { CheckoutVisual } from "@/components/features/visuals/CheckoutVisual";
import { InventoryVisual } from "@/components/features/visuals/InventoryVisual";
import { LoyaltyVisual } from "@/components/features/visuals/LoyaltyVisual";
import { ReportingVisual } from "@/components/features/visuals/ReportingVisual";

export const metadata: Metadata = {
  title: "Features | Laci POS - High Performance Systems",
  description:
    "Engineered for throughput: hyper-kinetic checkout, atomic inventory mapping, a behavioral retention engine, and forensic system audits.",
};

export default function FeaturesPage() {
  return (
    <>
      <ScrollEffects />
      <Navbar active="features" />
      <main className="pt-20">
        <div className="grid-bg relative border-x-2 border-brand-black max-w-7xl mx-auto bg-white shadow-brutal overflow-hidden">
          <Ticker />
          <FeaturesHero />

          <FeatureModule
            number="01"
            icon="ph-bold ph-lightning"
            iconChipClassName="bg-brand-lime text-brand-black shadow-brutal"
            title={
              <>
                Hyper-Kinetic
                <br />
                Checkout
              </>
            }
            description="Process orders at the speed of thought. Hold and resume concurrent sales, inject transaction-level discounting, and split payments fluidly across Cash, Card, or QRIS without locking the terminal."
            bullets={[
              { icon: "ph-bold ph-check text-brand-orange", label: "Pre-cached catalog rendering" },
              { icon: "ph-bold ph-check text-brand-orange", label: "Omni-tender split payments" },
              { icon: "ph-bold ph-check text-brand-orange", label: "Digital & Hardcopy receipt routing" },
            ]}
            visual={<CheckoutVisual />}
            visualBgClassName="bg-[#EBE8D8]"
            variant="light"
          />

          <FeatureModule
            number="02"
            icon="ph-bold ph-stack"
            iconChipClassName="bg-brand-orange text-white shadow-brutal"
            title={
              <>
                Atomic Inventory
                <br />
                Mapping
              </>
            }
            description="Track deeply nested product variants and barcodes with zero sync-drift. Organize granular price books instantly per outlet, reconcile stock logic visually, and trigger automated low-stock supply chain alerts."
            bullets={[
              { icon: "ph-bold ph-caret-right text-brand-orange", label: "Global multi-location synchronization" },
              { icon: "ph-bold ph-caret-right text-brand-orange", label: "Expiry & Batch validation algorithms" },
              { icon: "ph-bold ph-caret-right text-brand-orange", label: "Native Purchase Order generation" },
            ]}
            visual={<InventoryVisual />}
            visualBgClassName="bg-zinc-900 hidden md:block"
            reversed
            variant="dark"
          />

          <FeatureModule
            number="03"
            icon="ph-bold ph-asterisk-simple"
            iconChipClassName="bg-white text-brand-black shadow-brutal"
            title={
              <>
                Behavioral
                <br />
                Retention Engine
              </>
            }
            description="Stop guessing. Build crystalline customer profiles paired with exact purchase telemetry. Deploy algorithmic point tiers, trigger happy-hour pricing automatically, and mint targeted voucher strings."
            bullets={[
              { icon: "ph-bold ph-arrow-right text-brand-black", label: "Historic lifecycle tracking" },
              { icon: "ph-bold ph-arrow-right text-brand-black", label: "Dynamic BOGO bundle protocols" },
              { icon: "ph-bold ph-arrow-right text-brand-black", label: "Frictionless tier ascensions" },
            ]}
            visual={<LoyaltyVisual />}
            visualBgClassName="bg-brand-lime"
            variant="lime"
          />

          <FeatureModule
            number="04"
            icon="ph-bold ph-shield-check"
            iconChipClassName="bg-brand-black text-brand-lime shadow-[4px_4px_0px_#FF4911]"
            title={
              <>
                Forensic System
                <br />
                Audits
              </>
            }
            description="Eliminate shadow shrink. Export crystalline shift and sales reports natively to Excel/CSV configurations designed for enterprise accounting. Maintain an unbreakable audit trail of every terminal interaction."
            bullets={[
              { icon: "ph-bold ph-lock-key text-brand-orange", label: "Granular role-based permissions (RBAC)" },
              { icon: "ph-bold ph-file-csv text-brand-lime", label: "High-fidelity raw data pipelines" },
              { icon: "ph-bold ph-eye text-brand-black", label: "Chronological cryptographic action logs" },
            ]}
            visual={<ReportingVisual />}
            visualBgClassName="bg-zinc-200 hidden md:block"
            reversed
            variant="light"
          />

          <FeaturesCta />
        </div>
      </main>
      <Footer />
    </>
  );
}
