import { Fragment } from "react";
import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { LegalHero } from "@/components/legal/LegalHero";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Privacy Policy | Swillfam",
  description: "How Swillfam Group collects, uses, and protects your data.",
};

const sections: LegalSection[] = [
  {
    id: "overview",
    tocLabel: "1. Overview",
    heading: "1. Overview",
    body: (
      <Fragment key="overview-body">
        <p>
          Swillfam Group (&ldquo;Swillfam&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;,
          &ldquo;our&rdquo;) owns and operates a portfolio of restaurants, bars, lounges, and
          clubs. This Privacy Policy explains how we collect, use, and protect personal
          information when you visit this website, make an inquiry, apply for a role with us, or
          interact with our venues, events, and promotions.
        </p>
        <p>
          By using this website or submitting information to us, you agree to the practices
          described below. If you do not agree, please do not submit your information to us.
        </p>
      </Fragment>
    ),
  },
  {
    id: "inquiry-data",
    tocLabel: "2. Information We Collect",
    heading: "2. Information We Collect",
    body: (
      <Fragment key="inquiry-data-body">
        <p>We collect information you choose to provide directly to us, including:</p>
        <ul>
          <li>
            <strong>Contact &amp; inquiry details</strong> — name, email, phone number, and
            message content submitted through our contact form.
          </li>
          <li>
            <strong>Reservation &amp; event requests</strong> — venue, date, party size, and
            related preferences when you request a table, private event, or guest list entry.
          </li>
          <li>
            <strong>Career applications</strong> — name, contact details, resume/CV, and any
            other information you submit when applying for a position at one of our venues.
          </li>
          <li>
            <strong>Browsing data</strong> — pages viewed and general device/browser information
            collected automatically while you browse this website.
          </li>
        </ul>
      </Fragment>
    ),
  },
  {
    id: "use-of-data",
    tocLabel: "3. How We Use Your Information",
    heading: "3. How We Use Your Information",
    body: (
      <Fragment key="use-of-data-body">
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your inquiries, reservation requests, and private event bookings.</li>
          <li>Review and process career applications submitted to our venues.</li>
          <li>
            Share news about new venue openings, events, talents, and promotions, where you have
            opted in to receive them.
          </li>
          <li>Maintain the security, performance, and integrity of this website.</li>
          <li>Comply with applicable legal and regulatory obligations.</li>
        </ul>
      </Fragment>
    ),
  },
  {
    id: "transaction-data",
    tocLabel: "4. Reservations, Events & Guest Data",
    heading: "4. Reservations, Events & Guest Data",
    body: (
      <Fragment key="transaction-data-body">
        <p>
          When you request a reservation, table, or private event at one of our venues, the
          details you provide are shared with the relevant venue&apos;s management team so they
          can plan for your visit. Guest list and event details are retained only for as long as
          needed to coordinate your visit and for our internal records.
        </p>
        <p>
          We do not sell guest, reservation, or applicant data to third parties.
        </p>
      </Fragment>
    ),
  },
  {
    id: "security",
    tocLabel: "5. Data Security",
    heading: "5. Data Security",
    body: (
      <Fragment key="security-body">
        <p>
          We apply reasonable administrative and technical safeguards to protect the information
          you share with us from unauthorized access, disclosure, or misuse. Access to inquiry,
          reservation, and application data is limited to staff who need it to do their jobs.
        </p>
        <p>
          No method of transmission or storage is completely secure, and we cannot guarantee
          absolute security of information submitted to us.
        </p>
      </Fragment>
    ),
  },
  {
    id: "cookies",
    tocLabel: "6. Cookies & Tracking",
    heading: "6. Cookies & Tracking",
    body: (
      <Fragment key="cookies-body">
        <p>
          This website uses essential cookies to operate correctly, and may use analytics
          cookies to help us understand how visitors browse our venues, events, and articles
          pages. You can control or disable cookies through your browser settings; doing so may
          affect some site functionality.
        </p>
      </Fragment>
    ),
  },
  {
    id: "rights",
    tocLabel: "7. Your Rights",
    heading: "7. Your Rights",
    body: (
      <Fragment key="rights-body">
        <p>
          Subject to applicable law, including Indonesia&apos;s Law No. 27 of 2022 on Personal
          Data Protection (&ldquo;UU PDP&rdquo;), you may request access to, correction of, or
          deletion of the personal information you have submitted to us. To exercise these
          rights, contact us using the details below.
        </p>
      </Fragment>
    ),
  },
  {
    id: "contact",
    tocLabel: "8. Contact",
    heading: "8. Contact",
    body: (
      <Fragment key="contact-body">
        <p>
          Questions about this Privacy Policy or how we handle your information can be sent to
          our team using the contact details on this page, or via our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </Fragment>
    ),
  },
];

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      <div className="relative">
        <SiteHeader />
        <LegalHero
          badgeLabel="Legal Documentation"
          title="Privacy Policy"
          lastUpdated="June 18, 2026"
          effectiveDate="June 18, 2026"
        />
      </div>
      <LegalDocument
        contactEmail="privacy@swillfam.com"
        noticeTitle="Important Notice"
        noticeBody={
          <Fragment key="notice-body">
            This Privacy Policy applies to Swillfam Group&apos;s website and your interactions
            with our restaurants, bars, lounges, and clubs. It does not cover third-party sites
            we may link to.
          </Fragment>
        }
        sections={sections}
      />
      <SiteFooter settings={settings} />
    </main>
  );
}
