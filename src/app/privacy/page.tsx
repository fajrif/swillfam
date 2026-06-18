import { Fragment } from "react";
import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Laci POS",
  description: "How PT. Laci Pos Indonesia collects, uses, and protects your data.",
};

const sections: LegalSection[] = [
  {
    id: "overview",
    tocLabel: "1. Overview",
    heading: "1. Overview",
    body: (
      <p key="overview-body">
        This Privacy Policy explains how PT. Laci Pos Indonesia (&ldquo;Laci POS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) handles
        two distinct kinds of data: (a) the contact details you submit through this marketing
        site when you reach out about Laci POS, and (b) the operational data processed by a Laci
        POS instance once deployed for your business. These are handled very differently, as
        explained in Sections 2 and 4 below.
      </p>
    ),
  },
  {
    id: "inquiry-data",
    tocLabel: "2. Information We Collect",
    heading: "2. Information We Collect",
    body: (
      <Fragment key="inquiry-data-body">
        <p>
          When you submit an inquiry or contact form on this site, we collect only what you give
          us:
        </p>
        <ul>
          <li>Your business name</li>
          <li>Your contact name</li>
          <li>Your email address</li>
          <li>Your phone number (optional)</li>
          <li>Which package you&apos;re interested in (Basic, Plus, or Business)</li>
          <li>Any message you include</li>
        </ul>
        <p>
          This information is stored in our database (hosted on Supabase) and is used solely to
          build and follow up on your inquiry. We do not run advertising trackers or sell this
          information to third parties.
        </p>
      </Fragment>
    ),
  },
  {
    id: "use-of-data",
    tocLabel: "3. How We Use Inquiry Data",
    heading: "3. How We Use Inquiry Data",
    body: (
      <p key="use-of-data-body">
        Inquiry data is used to respond to your request, prepare a quote, schedule onboarding, and
        maintain our internal record of active clients and contracts (server, domain, package, and
        contract dates). We do not use it for unrelated marketing without your consent, and we do
        not share it with third parties except service providers (such as our database host)
        strictly necessary to operate this site.
      </p>
    ),
  },
  {
    id: "transaction-data",
    tocLabel: "4. End-Customer Transaction Data",
    heading: "4. End-Customer Transaction Data",
    body: (
      <Fragment key="transaction-data-body">
        <p>
          Once you deploy Laci POS, the catalog, sales, customer, and staff data your business
          generates is stored entirely on <strong>your own dedicated server</strong> — never on
          this marketing site or its database. We do not access this data except to provide
          support you have requested, perform routine backups, or as required by law.
        </p>
        <p>
          If your business collects personal data from your own end customers (for example,
          loyalty program details) through Laci POS, you are the data controller for that
          information under applicable law, and you are responsible for your own compliance and
          disclosures to your customers.
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
        <p>Every dedicated install is hardened by design:</p>
        <ul>
          <li>No public inbound port — your server is reachable only via a Cloudflare Tunnel.</li>
          <li>Encrypted, automated database backups on a regular schedule.</li>
          <li>Rate-limiting and lockout on login attempts.</li>
          <li>Administrative tooling (e.g. API documentation) disabled in production.</li>
        </ul>
      </Fragment>
    ),
  },
  {
    id: "cookies",
    tocLabel: "6. Cookies & Tracking",
    heading: "6. Cookies & Tracking",
    body: (
      <p key="cookies-body">
        This site does not use third-party advertising or analytics cookies. Any cookies used by
        the deployed Laci POS application itself are strictly functional (for example, keeping you
        signed in) and are documented separately in your instance&apos;s own session-handling
        configuration.
      </p>
    ),
  },
  {
    id: "rights",
    tocLabel: "7. Your Rights",
    heading: "7. Your Rights",
    body: (
      <p key="rights-body">
        Under Indonesia&apos;s Law No. 27 of 2022 on Personal Data Protection (&ldquo;UU PDP&rdquo;), you have
        the right to access, correct, or request deletion of the inquiry data we hold about you,
        and to object to its further processing. To exercise any of these rights, contact us using
        the details in Section 8.
      </p>
    ),
  },
  {
    id: "contact",
    tocLabel: "8. Contact",
    heading: "8. Contact",
    body: (
      <p key="contact-body">
        Questions about this Privacy Policy, or requests relating to your data, can be sent to{" "}
        <a href="mailto:privacy@lacipos.com" className="text-brand-black font-bold underline underline-offset-2">
          privacy@lacipos.com
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <LegalDocument
        badgeLabel="Legal Documentation"
        title="Privacy Policy"
        lastUpdated="June 18, 2026"
        effectiveDate="June 18, 2026"
        contactEmail="privacy@lacipos.com"
        noticeTitle="Important Notice"
        noticeBody={
          <Fragment key="notice-body">
            This policy explains the limited contact data we collect on this site, separate from
            the operational data processed by your own dedicated Laci POS instance.
          </Fragment>
        }
        sections={sections}
      />
      <Footer />
    </>
  );
}
