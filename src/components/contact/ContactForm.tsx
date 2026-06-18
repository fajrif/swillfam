"use client";

import { useActionState } from "react";
import { submitInquiryAction, type ContactActionState } from "@/app/contact/actions";

const initialState: ContactActionState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiryAction, initialState);

  if (state.success) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-16">
        <div className="max-w-xl mx-auto text-center">
          <span className="inline-block bg-brand-lime text-brand-black font-display text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 mb-6 border-2 border-brand-black shadow-brutal">
            Thank You
          </span>
          <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-brand-black mb-4">
            We&apos;ve got your message.
          </h2>
          <p className="text-brand-black/70 font-medium">
            Thanks for reaching out — our sales team will review your details and contact you
            within one business day to help you pick the right package and get your business set
            up on Laci POS.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-16">
      <form action={formAction} className="max-w-xl mx-auto space-y-4 reveal-element">
        {/* Honeypot — visually hidden from sighted users, not display:none, so it still trips up bots that probe computed styles. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="company_site">Company website</label>
          <input id="company_site" name="company_site" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Business name" name="businessName" required />
          <Field label="Contact name" name="contactName" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone" name="phone" type="tel" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="packageInterest" className="block text-sm font-medium text-brand-black mb-1">
              Preferred package
            </label>
            <select
              id="packageInterest"
              name="packageInterest"
              defaultValue="BASIC"
              required
              className="w-full border border-brand-black/20 bg-zinc-200 px-3 py-2 text-sm"
            >
              <option value="BASIC">Basic</option>
              <option value="PLUS">Plus</option>
              <option value="BUSINESS">Business</option>
            </select>
          </div>
          <Field
            label="Expected number of users"
            name="expectedUsers"
            type="number"
            min={1}
            defaultValue={1}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-brand-black mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full border border-brand-black/20 bg-zinc-200 px-3 py-2 text-sm"
          />
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="bg-brand-lime text-brand-black border-2 border-brand-black font-display font-bold text-xs uppercase tracking-widest px-6 py-3 shadow-[4px_4px_0px_#111111] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send Inquiry"}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
  defaultValue?: string | number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-brand-black mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        defaultValue={defaultValue}
        required={required}
        className="w-full border border-brand-black/20 bg-zinc-200 px-3 py-2 text-sm"
      />
    </div>
  );
}
