import { prisma } from "@/lib/prisma";
import ClientsPanel from "@/components/admin/clients-panel";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { bookings: { orderBy: { eventDate: "desc" } } },
  });

  const dtos = clients.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    notes: c.notes,
    createdAt: c.createdAt.toISOString(),
    bookings: c.bookings.map((b) => ({
      id: b.id,
      eventName: b.eventName,
      eventDate: b.eventDate.toISOString(),
      status: b.status,
    })),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Clients</h1>
        <p className="text-sm text-ink-700/60">Contact history, event details, and notes.</p>
      </div>
      <ClientsPanel clients={dtos} />
    </div>
  );
}
