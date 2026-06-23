"use client";

import { useActionState, useState } from "react";
import { UploadCloud } from "lucide-react";
import { submitApplicationAction, type ApplicationActionState } from "@/app/careers/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: ApplicationActionState = {};

const fieldClass =
  "h-[50px] rounded-none border-0 border-b border-sf-border bg-transparent px-0 font-inter text-white placeholder:text-white/50 focus-visible:border-white focus-visible:ring-0";

export function ApplicationForm({ careers }: { careers: { id: string; jobTitle: string }[] }) {
  const [state, formAction, pending] = useActionState(submitApplicationAction, initialState);
  const [fileName, setFileName] = useState<string | null>(null);

  if (state.success) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-syne text-[clamp(1.75rem,4vw,40px)] leading-tight text-white">
          Application received.
        </h2>
        <p className="font-inter leading-relaxed text-white">
          Thanks for applying — the SwillFam team will review your submission and reach out if
          there&apos;s a fit.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <h2 className="font-syne text-[clamp(1.75rem,4vw,40px)] leading-tight text-white">
        Apply Now
      </h2>
      <p className="font-inter leading-relaxed text-white">
        Interested in joining SwillFam? Fill in the application form below and our team will review
        your submission.
      </p>

      {/* Honeypot — visually hidden from sighted users, not display:none, so it still trips up bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company_site">Company website</label>
        <input id="company_site" name="company_site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Input name="fullName" type="text" required placeholder="Full Name*" className={fieldClass} />
      <Input name="email" type="email" required placeholder="Email*" className={fieldClass} />

      <select
        name="careerId"
        defaultValue=""
        className="h-[50px] rounded-none border-0 border-b border-sf-border bg-transparent px-0 font-inter text-white focus-visible:border-white focus-visible:outline-none [&>option]:bg-sf-surface [&>option]:text-white"
      >
        <option value="">Position Applied For</option>
        {careers.map((career) => (
          <option key={career.id} value={career.id}>
            {career.jobTitle}
          </option>
        ))}
      </select>

      {/* Upload CV */}
      <label className="flex h-[50px] cursor-pointer items-center gap-3 border-b border-sf-border font-inter text-white/50 transition-colors hover:text-white">
        <UploadCloud className="size-5" />
        <span>{fileName ?? "Upload CV"}</span>
        <input
          type="file"
          name="resume"
          accept="application/pdf"
          required
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>

      {state.error ? <p className="font-inter text-sm text-sf-accent">{state.error}</p> : null}

      <Button type="submit" variant="pill" size="pill" disabled={pending} className="w-fit">
        {pending ? "Sending…" : "Submit"}
      </Button>
    </form>
  );
}
