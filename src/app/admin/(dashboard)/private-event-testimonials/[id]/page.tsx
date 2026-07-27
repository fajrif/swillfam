import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PrivateEventTestimonialForm } from "@/components/admin/PrivateEventTestimonialForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import {
  updatePrivateEventTestimonialAction,
  deletePrivateEventTestimonialAction,
} from "../actions";

export default async function EditPrivateEventTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [testimonial, privateEvents] = await Promise.all([
    prisma.privateEventTestimonial.findUnique({ where: { id } }),
    prisma.privateEvent.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true } }),
  ]);
  if (!testimonial) notFound();

  return (
    <div>
      <EditHeader title="Edit Testimonial" backHref="/admin/private-event-testimonials" />
      <Card>
        <PrivateEventTestimonialForm
          action={updatePrivateEventTestimonialAction.bind(null, id)}
          testimonial={testimonial}
          privateEvents={privateEvents}
        />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton
            action={deletePrivateEventTestimonialAction.bind(null, id)}
            label="Delete testimonial"
          />
        </div>
      </Card>
    </div>
  );
}
