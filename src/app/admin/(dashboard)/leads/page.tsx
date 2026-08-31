import { prisma } from "@/lib/prisma";
import LeadsTable from "@/components/admin/leads-table";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const dtos = leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    eventType: l.eventType,
    eventDate: l.eventDate ? l.eventDate.toISOString() : null,
    guestCount: l.guestCount,
    location: l.location,
    budgetRange: l.budgetRange,
    message: l.message,
    source: l.source,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Leads / Inquiries</h1>
        <p className="text-sm text-ink-700/60">All leads from the contact form, AI chat, and WhatsApp.</p>
      </div>
      <LeadsTable leads={dtos} />
    </div>
  );
}
