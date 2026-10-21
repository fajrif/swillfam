import { requireAdministrator } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/site-settings";
import { getImageAltRecord } from "@/lib/image-alt";
import { MOMENTS_SETTING_KEY, parseMoments } from "@/lib/private-event-moments";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { PrivateEventMomentsForm } from "@/components/admin/PrivateEventMomentsForm";
import { savePrivateEventMomentsAction } from "./actions";

export default async function PrivateEventMomentsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdministrator();
  const { saved } = await searchParams;
  const [settings, altsByPath] = await Promise.all([getSiteSettings(), getImageAltRecord()]);
  const images = parseMoments(settings[MOMENTS_SETTING_KEY]);

  return (
    <div>
      <PageHeader title="Private Event Moments" />
      <Card>
        <p className="mb-6 max-w-3xl text-sm text-zinc-500">
          The “Moments We’ve Hosted” carousel on the Private Events page. Leave it empty to hide
          the section.
        </p>
        {saved ? (
          <p className="mb-6 text-sm font-medium text-green-700">Gallery saved.</p>
        ) : null}
        {/* Keyed by the saved list so the uploader remounts after a save and
            starts from the stored paths rather than its old in-memory state. */}
        <PrivateEventMomentsForm
          key={images.join("|")}
          action={savePrivateEventMomentsAction}
          images={images}
          altsByPath={altsByPath}
        />
      </Card>
    </div>
  );
}
