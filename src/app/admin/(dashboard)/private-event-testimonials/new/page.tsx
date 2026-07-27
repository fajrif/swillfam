import { prisma } from "@/lib/prisma";
import { PrivateEventTestimonialForm } from "@/components/admin/PrivateEventTestimonialForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createPrivateEventTestimonialAction } from "../actions";

export default async function NewPrivateEventTestimonialPage() {
  const privateEvents = await prisma.privateEvent.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div>
      <EditHeader title="New Testimonial" backHref="/admin/private-event-testimonials" />
      <Card>
        <PrivateEventTestimonialForm
          action={createPrivateEventTestimonialAction}
          privateEvents={privateEvents}
        />
      </Card>
    </div>
  );
}
