import Link from "next/link";
import type { AdminRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdministrator } from "@/lib/admin-auth";
import { ADMIN_ROLE_LABEL } from "@/lib/admin-roles";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { Thumb } from "@/components/admin/Thumb";

const ROLE_PILL: Record<AdminRole, string> = {
  ADMINISTRATOR: "bg-purple-100 text-purple-700",
  OPERATOR: "bg-zinc-100 text-zinc-700",
};

export default async function AdminUsersPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requireAdministrator();
  const { q, page } = await props.searchParams;
  const search = q && q.length >= 3 ? q : undefined;
  const p = Math.max(1, Number(page) || 1);
  const pageSize = 20;
  const skip = (p - 1) * pageSize;
  const where = search
    ? {
        OR: [
          { fullName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;
  const [users, total] = await Promise.all([
    prisma.adminUser.findMany({
      where,
      skip,
      take: pageSize,
      // Enum order puts administrators first.
      orderBy: [{ role: "asc" }, { fullName: "asc" }],
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        avatar: true,
        role: true,
        venue: { select: { name: true } },
      },
    }),
    prisma.adminUser.count({ where }),
  ]);

  return (
    <div>
      <PageHeader title="Admin Users" newHref="/admin/users/new" newLabel="New user" />
      <SearchInput placeholder="Search by name or email..." />
      <Card>
        <AdminTable
          rows={users}
          getKey={(u) => u.id}
          empty="No admin users yet."
          columns={[
            { header: "", cell: (u) => <Thumb src={u.avatar} alt={u.fullName} />, className: "w-12" },
            {
              header: "Name",
              cell: (u) => (
                <>
                  <Link href={`/admin/users/${u.id}`} className="font-medium text-zinc-900 hover:underline">
                    {u.fullName}
                  </Link>
                  <div className="text-xs text-zinc-400">{u.email}</div>
                </>
              ),
            },
            { header: "Position", cell: (u) => u.position ?? "—" },
            {
              header: "Role",
              cell: (u) => (
                <span className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-1 ${ROLE_PILL[u.role]}`}>
                  {ADMIN_ROLE_LABEL[u.role]}
                </span>
              ),
            },
            { header: "Venue", cell: (u) => u.venue?.name ?? "—" },
          ]}
        />
        <Pagination page={p} totalPages={Math.ceil(total / pageSize)} />
      </Card>
    </div>
  );
}
