import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { deleteApplicationAction } from "../actions";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { career: { select: { id: true, jobTitle: true } } },
  });
  if (!application) notFound();

  return (
    <div>
      <EditHeader title="Application" backHref="/admin/applications" />
      <Card>
        <div className="space-y-6 max-w-xl">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Applicant" value={application.fullName} />
            <Info label="Email" value={application.email} />
          </div>

          <div>
            <div className="text-sm text-zinc-500 mb-1">Applied for</div>
            <div className="font-medium text-zinc-900">{application.career?.jobTitle ?? "—"}</div>
          </div>

          <div>
            <div className="text-sm text-zinc-500 mb-1">Resume</div>
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Download CV (PDF)
            </a>
          </div>

          <div className="pt-6 border-t border-zinc-200">
            <ConfirmDeleteButton
              action={deleteApplicationAction.bind(null, id)}
              label="Delete application"
              confirmMessage="Delete this application and its uploaded resume? This cannot be undone."
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-zinc-500">{label}</div>
      <div className="font-medium text-zinc-900 break-words">{value}</div>
    </div>
  );
}
