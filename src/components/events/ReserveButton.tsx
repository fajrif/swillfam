import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * "Reserve via WhatsApp" CTA, used everywhere the event designs show one.
 *
 * On a retired event (`active: false`) the button stops offering a reservation
 * nobody can take, and becomes one of two things:
 *
 * - **`recapHref` set** — a live link to the recap further down the page. The
 *   brief asks a past event to send people to its recap rather than dead-end
 *   them, and it is the only CTA on such a page that still leads somewhere.
 * - **no recap** — the button stays in place but disabled (`SpecularButton`'s
 *   `disabled` branch renders a non-navigable `<span aria-disabled>`), dimmed
 *   and paired with a short reason, so the page reads as an archive rather than
 *   a broken booking flow.
 *
 * The recap branch is checked before `phone`: a page with a recap and no number
 * still has somewhere to send people.
 */
export function ReserveButton({
  eventName,
  venueName,
  phone,
  active,
  recapHref,
  label = "Reserve via WhatsApp",
  className,
}: {
  eventName: string;
  venueName?: string | null;
  /** The event's own `waPhone`, falling back to the site-wide number. */
  phone?: string | null;
  active: boolean;
  /** In-page link to the recap, set by the caller only when one is rendered. */
  recapHref?: string | null;
  label?: string;
  className?: string;
}) {
  if (!active && recapHref) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <SpecularButton href={recapHref} size="lg" radius={30} className="w-fit">
          Watch the Recap
        </SpecularButton>
        <p className="font-inter text-sm">This event has ended — see how it went.</p>
      </div>
    );
  }

  if (!phone) return null;

  if (!active) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <SpecularButton
          href="#"
          disabled
          size="lg"
          radius={30}
          className="w-fit cursor-not-allowed opacity-50"
        >
          {label}
        </SpecularButton>
        <p className="font-inter text-sm">This event has ended.</p>
      </div>
    );
  }

  return (
    <SpecularButton
      href={whatsappHref(
        phone,
        `Hi SwillFam, I'd like to reserve a spot for "${eventName}"${venueName ? ` at ${venueName}` : ""}.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      size="lg"
      radius={30}
      className={cn("w-fit", className)}
    >
      {label}
    </SpecularButton>
  );
}
