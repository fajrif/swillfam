"use client";

import { useActionState } from "react";
import { submitInquiryAction, type ContactActionState } from "@/app/contact/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState: ContactActionState = {};

const fieldClass =
  "h-[50px] rounded-none border-0 border-b border-sf-border bg-transparent px-0 font-inter text-white placeholder:text-white/50 focus-visible:border-white focus-visible:ring-0";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiryAction, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-syne text-[clamp(1.75rem,4vw,40px)] leading-tight text-white">
          We&apos;ve got your message.
        </h2>
        <p className="font-inter leading-relaxed text-white">
          Thanks for reaching out — the SwillFam team will review your message and get back to you as
          soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <h2 className="font-syne text-[clamp(1.75rem,4vw,40px)] leading-tight text-white">
        Let&apos;s Connect
      </h2>

      {/* Honeypot — visually hidden from sighted users, not display:none, so it still trips up bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company_site">Company website</label>
        <input id="company_site" name="company_site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Input name="fullName" type="text" required placeholder="Full Name*" className={fieldClass} />
      <Input name="email" type="email" required placeholder="Email*" className={fieldClass} />
      <Input name="subject" type="text" required placeholder="Subject*" className={fieldClass} />
      <Textarea
        name="description"
        rows={4}
        required
        placeholder="Your Description Here"
        className="resize-none rounded-none border-0 border-b border-sf-border bg-transparent px-0 font-inter text-white placeholder:text-white/50 focus-visible:border-white focus-visible:ring-0"
      />

      {state.error ? <p className="font-inter text-sm text-sf-accent">{state.error}</p> : null}

      <Button type="submit" variant="swillfam" size="pill" disabled={pending} className="w-fit">
        {pending ? "Sending…" : "Submit"}
      </Button>
    </form>
  );
}
