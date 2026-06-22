import { Fragment } from "react";
import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | Swillfam",
  description: "Terms and conditions governing the deployment and use of Swillfam.",
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    tocLabel: "1. Agreement to Terms",
    heading: "1. Agreement to Terms",
    body: (
      <Fragment key="agreement-body">
        <p>
          These Terms and Conditions (&ldquo;Terms&rdquo;) constitute a legally binding agreement
          between you, whether personally or on behalf of a business (&ldquo;Client&rdquo;,
          &ldquo;you&rdquo;), and Swillfam (&ldquo;Swillfam&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;), governing your access to and use of the Swillfam
          software, the dedicated server instance provisioned for your business, and any related
          dashboards or support services (collectively, the &ldquo;Service&rdquo;).
        </p>
        <p>
          By signing an order form, accepting a package quote, or accessing the Service, you
          confirm that you have read, understood, and agree to be bound by these Terms. If you do
          not agree, you must not use the Service.
        </p>
      </Fragment>
    ),
  },
  {
    id: "license",
    tocLabel: "2. Software License & Access",
    heading: "2. Software License & Access",
    body: (
      <Fragment key="license-body">
        <p>
          Swillfam is licensed, not sold. Subject to your compliance with these Terms and full
          payment under your selected package (Basic, Plus, or Business), we grant you a
          revocable, non-exclusive, non-transferable right to access and use the Service solely
          for your own business operations, for the duration of your contract term.
        </p>
        <h3>Prohibited Activities</h3>
        <p>You must not, and must not permit any third party to:</p>
        <ul>
          <li>Attempt to bypass authentication, rate-limiting, or other access controls.</li>
          <li>Reverse engineer, decompile, or disassemble any part of the application.</li>
          <li>Resell, sublicense, or provide access to the Service to unrelated businesses.</li>
          <li>
            Use the Service to process transactions unrelated to your own retail or hospitality
            operations.
          </li>
        </ul>
      </Fragment>
    ),
  },
  {
    id: "infrastructure",
    tocLabel: "3. Dedicated Infrastructure & Deployment",
    heading: "3. Dedicated Infrastructure & Deployment",
    body: (
      <Fragment key="infrastructure-body">
        <p>
          Each Client receives a single-tenant deployment: one dedicated server, running your own
          isolated database, reachable only through a Cloudflare Tunnel on your custom domain. We
          do not publish your server&apos;s origin IP, and no inbound port is opened on the host — this
          is a deliberate security design, not a convenience feature, and you must not request its
          removal.
        </p>
        <p>
          <strong>3.1 Uptime.</strong> We target 99.9% uptime for dedicated installs, excluding
          scheduled maintenance windows (communicated at least 24 hours in advance) and events
          outside our reasonable control (upstream provider outages, force majeure).
        </p>
        <p>
          <strong>3.2 Acceptable Use of Infrastructure.</strong> You must not run load tests,
          security scans, or any workload unrelated to point-of-sale operations against your
          instance without our prior written consent.
        </p>
      </Fragment>
    ),
  },
  {
    id: "billing",
    tocLabel: "4. Billing & Subscriptions",
    heading: "4. Billing & Subscriptions",
    body: (
      <Fragment key="billing-body">
        <p>
          Access to the Service is sold as a fixed-term package (Basic, Plus, or Business),
          typically for an initial term of twelve months, billed and invoiced as agreed in your
          order form. Renewal terms and pricing will be communicated before your contract end
          date; if you do not renew, access is suspended at term end subject to Section 6
          (Termination).
        </p>
        <p>
          Package upgrades, downgrades, and feature unlocks are performed by our team (via the
          local License & Package console) following your written request — they are not
          self-service, and we may decline a downgrade that would put existing data or usage
          outside the limits of the lower package.
        </p>
      </Fragment>
    ),
  },
  {
    id: "data",
    tocLabel: "5. Client Data & Operations",
    heading: "5. Client Data & Operations",
    body: (
      <Fragment key="data-body">
        <p>
          All catalog, transaction, customer, and staff data you enter into your Swillfam instance
          is stored exclusively on your dedicated server and database. We act as your
          infrastructure operator and data processor for that data — you remain the data
          controller, responsible for your own retail and tax record-keeping obligations.
        </p>
        <p>
          We do not access your operational data except: (a) to provide support you have
          requested, (b) to perform routine backups and maintenance, or (c) where required by law.
          See our{" "}
          <a href="/privacy" className="text-brand-black font-bold underline underline-offset-2">
            Privacy Policy
          </a>{" "}
          for how we handle the separate, limited set of data collected through this marketing
          site.
        </p>
      </Fragment>
    ),
  },
  {
    id: "termination",
    tocLabel: "6. Termination",
    heading: "6. Termination",
    body: (
      <Fragment key="termination-body">
        <p>
          Either party may terminate at the end of the contract term by giving notice as set out
          in your order form. We may suspend or terminate access immediately for non-payment, a
          material breach of these Terms, or unlawful use of the Service.
        </p>
        <p>
          Following termination, you have a 30-day grace period to export your data (including a
          full CSV export of your catalog and transaction history) before your dedicated server
          and its data are decommissioned and permanently deleted.
        </p>
      </Fragment>
    ),
  },
  {
    id: "liability",
    tocLabel: "7. Limitation of Liability",
    heading: "7. Limitation of Liability",
    body: (
      <Fragment key="liability-body">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, PT. SWILLFAM WILL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS OR LOST
          SALES DATA, ARISING FROM YOUR USE OF THE SERVICE, EXCEPT WHERE CAUSED BY OUR GROSS
          NEGLIGENCE OR WILLFUL MISCONDUCT.
        </p>
        <p>
          The Service is provided on an &ldquo;as is&rdquo; basis. While we design for high availability and
          take routine backups, we do not guarantee uninterrupted operation, and you are
          responsible for maintaining your own offline contingency procedures (e.g. manual sales
          records) during any outage.
        </p>
      </Fragment>
    ),
  },
  {
    id: "governing",
    tocLabel: "8. Governing Law",
    heading: "8. Governing Law",
    body: (
      <p key="governing-body">
        These Terms are governed by the laws of the Republic of Indonesia, including applicable
        provisions of Law No. 27 of 2022 on Personal Data Protection (&ldquo;UU PDP&rdquo;) where they apply to
        data handled under these Terms. Any dispute arising from these Terms will first be
        addressed through good-faith negotiation before resort to the courts of competent
        jurisdiction in Indonesia.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <LegalDocument
        badgeLabel="Legal Documentation"
        title="Terms & Conditions"
        lastUpdated="June 18, 2026"
        effectiveDate="June 18, 2026"
        contactEmail="legal@swillfam.com"
        noticeTitle="Important Notice"
        noticeBody={
          <Fragment key="notice-body">
            Please read these Terms carefully before deploying or using Swillfam. By accepting a
            package quote or accessing your dedicated instance, you agree to these conditions.
          </Fragment>
        }
        sections={sections}
      />
      <Footer />
    </>
  );
}
