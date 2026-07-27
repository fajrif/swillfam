import Link from "next/link";
import type { SiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

const SOCIALS = [
  { icon: "ph-linkedin-logo", label: "LinkedIn", key: "socialLinkedin" },
  { icon: "ph-tiktok-logo", label: "TikTok", key: "socialTiktok" },
  { icon: "ph-youtube-logo", label: "YouTube", key: "socialYoutube" },
  { icon: "ph-instagram-logo", label: "Instagram", key: "socialInstagram" },
  { icon: "ph-whatsapp-logo", label: "WhatsApp", key: "mainWhatsapp", whatsapp: true as const },
];

export function SocialIcons({
  settings,
  className,
}: {
  settings: SiteSettings;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-end gap-1", className)}>
      <p className="font-inter text-base text-white">Find us:</p>
      <div className="flex gap-4">
        {SOCIALS.map(({ icon, label, key, whatsapp }) => {
          let href: string;
          if (whatsapp && settings[key]) {
            href = `https://wa.me/${settings[key]!.replace(/[^0-9]/g, "")}`;
          } else {
            href = settings[key] || "#";
          }
          return (
            <Link
              key={label}
              href={href}
              target={href !== "#" ? "_blank" : undefined}
              rel={href !== "#" ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="text-white transition-colors hover:text-sf-accent"
            >
              <i className={`ph ${icon} text-xl`} aria-hidden />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
