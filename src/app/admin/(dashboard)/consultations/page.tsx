import { prisma } from "@/lib/prisma";
import ConsultationsTable from "@/components/admin/consultations-table";

export const dynamic = "force-dynamic";

export default async function ConsultationsPage() {
  const appointments = await prisma.appointment.findMany({
    include: { lead: true },
    orderBy: { date: "desc" },
  });

  const dtos = appointments.map((a) => ({
    id: a.id,
    leadId: a.leadId,
    leadName: a.lead.name,
    leadEmail: a.lead.email,
    leadPhone: a.lead.phone,
    eventType: a.lead.eventType,
    date: a.date.toISOString(),
    duration: a.duration,
    status: a.status,
    notes: a.notes,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Consultations</h1>
        <p className="text-sm text-ink-700/60">Consultation calls booked through the AI concierge or by your team.</p>
      </div>
      <ConsultationsTable consultations={dtos} />
    </div>
  );
}
