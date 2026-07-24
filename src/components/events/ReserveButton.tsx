import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * "Reserve via WhatsApp" CTA, used everywhere the event designs show one.
 *
 * A retired event (`active: false`) keeps the button in place but disabled —
 * `SpecularButton`'s `disabled` branch renders a non-navigable `<span
 * aria-disabled>` — dimmed and paired with a short reason, so the page reads as
 * an archive rather than a broken booking flow. Renders nothing when there is no
 * number to reserve against.
 */
export function ReserveButton({
  eventName,
  venueName,
  phone,
  active,
  label = "Reserve via WhatsApp",
  className,
}: {
  eventName: string;
  venueName?: string | null;
  /** The event's own `waPhone`, falling back to the site-wide number. */
  phone?: string | null;
  active: boolean;
  label?: string;
  className?: string;
}) {
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
        <p className="font-inter text-sm text-white">This event has ended.</p>
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
