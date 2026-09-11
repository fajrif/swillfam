import { WhatsappLogo, XLogo, ThreadsLogo, FacebookLogo } from "@phosphor-icons/react/ssr";
import { SpecularButton } from "@/components/reactbits/SpecularButton";

function shareTargets(url: string, title: string) {
  const text = `${title} ${url}`;
  return [
    { Icon: WhatsappLogo, label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(text)}` },
    {
      Icon: XLogo,
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    { Icon: ThreadsLogo, label: "Threads", href: `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}` },
    {
      Icon: FacebookLogo,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ] as const;
}

/** Circular specular icon buttons that share the given page to social media. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      {shareTargets(url, title).map(({ Icon, label, href }) => (
        <SpecularButton
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          variant="icon"
          size="lg"
          ariaLabel={`Share this on ${label}`}
        >
          <Icon weight="regular" className="size-5" />
        </SpecularButton>
      ))}
    </div>
  );
}
