"use client";

import Link from "next/link";
import Image from "next/image";
import type { AdminRole } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/logout/actions";
import { ADMIN_ROLE_LABEL } from "@/lib/admin-roles";
import { AdminAvatar } from "./AdminAvatar";

type NavGroup = { label: string; items: { href: string; label: string }[] };

const ADMINISTRATOR_NAV: NavGroup[] = [
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
      { href: "/admin/talent-categories", label: "Talent Categories" },
      { href: "/admin/talents", label: "Talents" },
    ],
  },
  {
    label: "Programs",
    items: [
      { href: "/admin/promotion-categories", label: "Promotion Categories" },
      { href: "/admin/promotions", label: "Promotions" },
      { href: "/admin/event-categories", label: "Event Categories" },
      { href: "/admin/events", label: "Events" },
      { href: "/admin/event-types", label: "Event Types" },
      { href: "/admin/private-events", label: "Private Events" },
      { href: "/admin/private-event-occasions", label: "Private Event Occasions" },
      { href: "/admin/private-event-testimonials", label: "Private Event Testimonials" },
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
      { href: "/admin/media-mentions", label: "Media Mentions" },
    ],
  },
  {
    label: "People",
    items: [{ href: "/admin/careers", label: "Careers" }],
  },
  {
    label: "System",
    items: [
      { href: "/admin/users", label: "Admin Users" },
      { href: "/admin/settings", label: "Settings" },
      { href: "/admin/page-seo", label: "Page SEO" },
    ],
  },
];

/** Operators only see their own venue's sections (mirrors the allowlist in proxy.ts). */
function operatorNav(venue: { id: string; name: string } | null): NavGroup[] {
  if (!venue) return [];
  return [
    {
      label: venue.name,
      items: [
        { href: `/admin/venues/${venue.id}`, label: "Venue Info" },
        { href: "/admin/events", label: "Events" },
        { href: "/admin/promotions", label: "Promotions" },
        { href: "/admin/segment-galleries", label: "Segment Galleries" },
        { href: "/admin/faqs", label: "FAQs" },
      ],
    },
    {
      label: "People",
      items: [{ href: "/admin/talents", label: "Talents" }],
    },
  ];
}

export type SidebarAdmin = {
  fullName: string;
  email: string;
  avatar: string | null;
  role: AdminRole;
  venue: { id: string; name: string } | null;
};

export function Sidebar({ admin }: { admin: SidebarAdmin }) {
  const groups = admin.role === "ADMINISTRATOR" ? ADMINISTRATOR_NAV : operatorNav(admin.venue);

  return (
    <aside className="w-60 shrink-0 bg-sidebar text-sidebar-foreground border-r flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b bg-black text-white">
        <Link href="/"><Image src="/logo-swillfam.png" alt="Swillfam" width={100} height={44} className="cursor-pointer" /></Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-sm font-medium">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
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
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <AdminAvatar src={admin.avatar} name={admin.fullName} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{admin.fullName}</div>
            <div className="truncate text-xs text-muted-foreground">
              {ADMIN_ROLE_LABEL[admin.role]}
              {admin.venue ? ` · ${admin.venue.name}` : ""}
            </div>
          </div>
        </Link>
        <form action={logoutAction} onSubmit={(e) => { if (!confirm("Are you sure you want to logout?")) e.preventDefault(); }}>
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-between">
            Log out
            <LogOut className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </div>
    </aside>
  );
}
