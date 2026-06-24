import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_GROUPS: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: "Inbox",
    items: [
      { href: "/admin/inquiries", label: "Inquiries" },
      { href: "/admin/applications", label: "Applications" },
    ],
  },
  {
    label: "Venues",
    items: [
      { href: "/admin/categories", label: "Venue Categories" },
      { href: "/admin/venues", label: "Venues" },
      { href: "/admin/segment-galleries", label: "Segment Galleries" },
      { href: "/admin/talents", label: "Talents" },
    ],
  },
  {
    label: "Programming",
    items: [
      { href: "/admin/promotions", label: "Promotions" },
      { href: "/admin/event-categories", label: "Event Categories" },
      { href: "/admin/events", label: "Events" },
    ],
  },
  {
    label: "Private Events",
    items: [
      { href: "/admin/event-types", label: "Event Types" },
      { href: "/admin/private-events", label: "Private Events" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/article-categories", label: "Article Categories" },
      { href: "/admin/articles", label: "Articles" },
      { href: "/admin/galleries", label: "Galleries" },
      { href: "/admin/videos", label: "Videos" },
      { href: "/admin/merchandises", label: "Merchandises" },
      { href: "/admin/faqs", label: "FAQs" },
    ],
  },
  {
    label: "People",
    items: [{ href: "/admin/careers", label: "Careers" }],
  },
  {
    label: "System",
    items: [{ href: "/admin/settings", label: "Settings" }],
  },
];

export function Sidebar({ email }: { email: string }) {
  return (
    <aside className="w-60 shrink-0 bg-sidebar text-sidebar-foreground border-r flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b bg-black text-white">
        <span className="font-display text-sm tracking-widest uppercase">SWILLFAM</span>
        <div className="text-xs mt-1">Admin</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-sm font-medium">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <Separator />
      <div className="px-3 py-4 space-y-2">
        <div className="px-3 text-xs text-muted-foreground truncate">{email}</div>
        <form action="/admin/logout" method="POST">
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
            Log out
          </Button>
        </form>
      </div>
    </aside>
  );
}
