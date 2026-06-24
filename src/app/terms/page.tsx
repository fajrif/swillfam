import { Fragment } from "react";
import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { LegalHero } from "@/components/legal/LegalHero";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Terms & Conditions | Swillfam",
  description: "Terms and conditions governing the use of Swillfam Group's website and venues.",
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    tocLabel: "1. Agreement to Terms",
    heading: "1. Agreement to Terms",
    body: (
      <Fragment key="agreement-body">
        <p>
          These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of this website and
          your visit to any restaurant, bar, lounge, or club operated by Swillfam Group
          (&ldquo;Swillfam&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
        </p>
        <p>
          By browsing this website, submitting an inquiry, requesting a reservation, or visiting
          one of our venues, you agree to be bound by these Terms. If you do not agree, please
          do not use this website or visit our venues.
        </p>
      </Fragment>
    ),
  },
  {
    id: "license",
    tocLabel: "2. Use of This Website",
    heading: "2. Use of This Website",
    body: (
      <Fragment key="license-body">
        <p>
          This website is provided for you to learn about our venues, events, talents,
          promotions, merchandise, and career opportunities, and to get in touch with our team.
          You may not use it for any unlawful purpose.
        </p>
        <h3>Prohibited Activities</h3>
        <p>You must not, and must not permit any third party to:</p>
        <ul>
          <li>Attempt to bypass authentication, rate-limiting, or other access controls.</li>
          <li>Reverse engineer, decompile, or disassemble any part of this website.</li>
          <li>Submit false, misleading, or fraudulent information through our forms.</li>
          <li>
            Use automated means to scrape, copy, or extract content from this website without
            our prior written consent.
          </li>
        </ul>
      </Fragment>
    ),
  },
  {
    id: "infrastructure",
    tocLabel: "3. Reservations, Events & Promotions",
    heading: "3. Reservations, Events & Promotions",
    body: (
      <Fragment key="infrastructure-body">
        <p>
          Reservation, table, and private event requests submitted through this website are
          requests only and are not confirmed until our venue team responds to you directly.
          Capacity, minimum spend, and dress code requirements vary by venue and may be
          communicated at the time of confirmation.
        </p>
        <p>
          <strong>3.1 Promotions.</strong> Promotions and offers published on this website are
          valid for the dates and venues stated, are subject to availability, and may be
          changed, ended, or withdrawn by us at any time without notice.
        </p>
        <p>
          <strong>3.2 Events.</strong> Event line-ups, talents, and schedules are subject to
          change. We are not liable for changes to advertised performers or programming beyond
          our reasonable control.
        </p>
      </Fragment>
    ),
  },
  {
    id: "billing",
    tocLabel: "4. Age Restriction & Responsible Service",
    heading: "4. Age Restriction & Responsible Service",
    body: (
      <Fragment key="billing-body">
        <p>
          Our bars, lounges, and clubs serve alcohol and are intended for guests of legal
          drinking age under applicable Indonesian law. We may require valid government-issued
          identification before granting entry or serving alcohol, and may refuse entry or
          service where age cannot be verified.
        </p>
        <p>
          We practice responsible service of alcohol and reserve the right to refuse further
          service to any guest at our discretion.
        </p>
      </Fragment>
    ),
  },
  {
    id: "data",
    tocLabel: "5. Guest Conduct at Our Venues",
    heading: "5. Guest Conduct at Our Venues",
    body: (
      <Fragment key="data-body">
        <p>
          Guests are expected to follow venue house rules, dress codes, and staff instructions at
          all times. We reserve the right to refuse entry to, or remove, any guest whose conduct
          is unlawful, unsafe, or disruptive to other guests or staff.
        </p>
        <p>
          For details on how we handle information collected through reservations, inquiries, and
          career applications, see our{" "}
          <a href="/privacy" className="text-sf-accent font-bold underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </Fragment>
    ),
  },
  {
    id: "termination",
    tocLabel: "6. Intellectual Property",
    heading: "6. Intellectual Property",
    body: (
      <Fragment key="termination-body">
        <p>
          All trademarks, logos, venue names, photography, and content published on this website
          belong to Swillfam Group or our licensors. You may not reproduce, distribute, or
          create derivative works from this content without our prior written consent.
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
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SWILLFAM GROUP WILL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THIS
          WEBSITE OR YOUR VISIT TO ANY OF OUR VENUES, EXCEPT WHERE CAUSED BY OUR GROSS NEGLIGENCE
          OR WILLFUL MISCONDUCT.
        </p>
        <p>
          This website and the information on it are provided on an &ldquo;as is&rdquo; basis.
          Venue details, event schedules, and promotions are subject to change without notice.
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
        provisions of Law No. 27 of 2022 on Personal Data Protection (&ldquo;UU PDP&rdquo;) where
        they apply to data handled under these Terms. Any dispute arising from these Terms will
        first be addressed through good-faith negotiation before resort to the courts of
        competent jurisdiction in Indonesia.
      </p>
    ),
  },
];

export default async function TermsPage() {
  const settings = await getSiteSettings();
  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      <div className="relative">
        <SiteHeader />
        <LegalHero
          badgeLabel="Legal Documentation"
          title="Terms & Conditions"
          lastUpdated="June 18, 2026"
          effectiveDate="June 18, 2026"
        />
      </div>
      <LegalDocument
        contactEmail="legal@swillfam.com"
        noticeTitle="Important Notice"
        noticeBody={
          <Fragment key="notice-body">
            Please read these Terms carefully before using this website or visiting one of our
            venues. By doing so, you agree to these conditions.
          </Fragment>
        }
        sections={sections}
      />
      <SiteFooter settings={settings} />
    </main>
  );
}
