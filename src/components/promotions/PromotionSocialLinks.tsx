import { InstagramLogo, XLogo, ThreadsLogo, FacebookLogo } from "@phosphor-icons/react/ssr";
import type { Promotion } from "@/generated/prisma/client";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

type PromotionSocials = Pick<Promotion, "instagramUrl" | "xUrl" | "threadsUrl" | "facebookUrl">;

const SOCIALS = [
  { Icon: InstagramLogo, label: "Instagram", key: "instagramUrl" },
  { Icon: XLogo, label: "X", key: "xUrl" },
  { Icon: ThreadsLogo, label: "Threads", key: "threadsUrl" },
  { Icon: FacebookLogo, label: "Facebook", key: "facebookUrl" },
] as const;

/** Circular specular icon buttons linking out to this promotion's own social posts. */
export function PromotionSocialLinks({ promotion }: { promotion: PromotionSocials }) {
  const links = SOCIALS.filter(({ key }) => promotion[key]);
  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-4">
      {links.map(({ Icon, label, key }) => (
        <SpecularButton
          key={key}
          href={promotion[key]!}
          target="_blank"
          rel="noopener noreferrer"
          variant="icon"
          size="lg"
          ariaLabel={`View this promotion on ${label}`}
        >
          <Icon weight="regular" className="size-5" />
        </SpecularButton>
      ))}
    </div>
  );
}
