import { prisma } from "@/lib/prisma";
import BookingsCalendar from "@/components/admin/bookings-calendar";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const [bookings, clients] = await Promise.all([
    prisma.booking.findMany({ orderBy: { eventDate: "asc" } }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  const dtos = bookings.map((b) => ({
    id: b.id,
    eventName: b.eventName,
    eventType: b.eventType,
    eventDate: b.eventDate.toISOString(),
    location: b.location,
    guestCount: b.guestCount,
    status: b.status,
    notes: b.notes,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Bookings / Calendar</h1>
        <p className="text-sm text-ink-700/60">Confirmed and tentative events, with conflict detection.</p>
      </div>
      <BookingsCalendar bookings={dtos} clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
