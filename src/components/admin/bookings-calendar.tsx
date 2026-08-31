"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type BookingDTO = {
  id: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  location: string | null;
  guestCount: number | null;
  status: string;
  notes: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  TENTATIVE: "bg-amber-500",
  CONFIRMED: "bg-brass-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-red-400",
};

const EVENT_TYPES = ["Wedding", "Corporate Event", "Private Party", "Baby Shower", "Anniversary"];

export default function BookingsCalendar({ bookings: initial, clients }: {
  bookings: BookingDTO[];
  clients: { id: string; name: string }[];
}) {
  const [bookings, setBookings] = useState(initial);
  const [month, setMonth] = useState(new Date());
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [editing, setEditing] = useState<BookingDTO | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [form, setForm] = useState({ eventName: "", eventType: EVENT_TYPES[0], location: "", guestCount: "", clientId: "" });

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const bookingsFor = (day: Date) => bookings.filter((b) => isSameDay(new Date(b.eventDate), day));

  const rescheduleBooking = async (id: string, date: Date) => {
    let res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventDate: date.toISOString() }),
    });
    if (res.status === 409) {
      const data = await res.json();
      const names = data.conflicts.map((c: { eventName: string }) => c.eventName).join(", ");
      if (!confirm(`This date conflicts with: ${names}. Schedule anyway?`)) return;
      res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventDate: date.toISOString(), force: true }),
      });
    }
    if (res.ok) {
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, eventDate: updated.eventDate } : b)));
    }
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalDate) return;
    let res = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, eventDate: modalDate.toISOString() }),
    });
    if (res.status === 409) {
      const data = await res.json();
      const names = data.conflicts.map((c: { eventName: string }) => c.eventName).join(", ");
      if (!confirm(`This date conflicts with: ${names}. Schedule anyway?`)) return;
      res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventDate: modalDate.toISOString(), force: true }),
      });
    }
    if (res.ok) {
      const created = await res.json();
      setBookings((prev) => [...prev, created]);
      setModalDate(null);
      setForm({ eventName: "", eventType: EVENT_TYPES[0], location: "", guestCount: "", clientId: "" });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEditing((e) => (e ? { ...e, status } : e));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl italic text-ink-900">{format(month, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <button onClick={() => setMonth((m) => subMonths(m, 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/15 hover:border-brass-500">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setMonth(new Date())} className="rounded-full border border-ink-900/15 px-3 py-1 text-xs hover:border-brass-500">
            Today
          </button>
          <button onClick={() => setMonth((m) => addMonths(m, 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/15 hover:border-brass-500">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-ink-900/10 bg-ink-900/10 text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="bg-beige-200/60 px-2 py-2 text-center font-medium uppercase tracking-wide text-ink-700/60">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const dayBookings = bookingsFor(day);
          return (
            <div
              key={day.toISOString()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) rescheduleBooking(dragId, day);
                setDragId(null);
              }}
              className={cn(
                "group relative flex min-h-[92px] flex-col gap-1 bg-beige-100 p-1.5 sm:min-h-[110px]",
                !isSameMonth(day, month) && "bg-beige-100/40 text-ink-900/30"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-[11px]", isSameDay(day, new Date()) && "font-semibold text-brass-500")}>
                  {format(day, "d")}
                </span>
                <button
                  onClick={() => setModalDate(day)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Add booking"
                >
                  <Plus className="h-3.5 w-3.5 text-ink-700/50 hover:text-brass-500" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {dayBookings.map((b) => (
                  <button
                    key={b.id}
                    draggable
                    onDragStart={() => setDragId(b.id)}
                    onClick={() => setEditing(b)}
                    className="flex items-center gap-1 truncate rounded bg-ink-900/5 px-1.5 py-1 text-left text-[10px] hover:bg-ink-900/10"
                    title={b.eventName}
                  >
                    <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", STATUS_COLORS[b.status])} />
                    <span className="truncate">{b.eventName}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ink-700/40">Drag an event to a new day to reschedule. Click + to add, click an event to edit.</p>

      {modalDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-6">
          <form onSubmit={submitBooking} className="w-full max-w-sm rounded-lg bg-beige-100 p-6 shadow-xl">
            <h3 className="mb-4 font-display text-lg italic text-ink-900">New Booking — {format(modalDate, "MMM d, yyyy")}</h3>
            <div className="flex flex-col gap-3">
              <input required placeholder="Event name" value={form.eventName} onChange={(e) => setForm((f) => ({ ...f, eventName: e.target.value }))} className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none" />
              <select value={form.eventType} onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))} className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none">
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))} className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none">
                <option value="">No client linked</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none" />
              <input type="number" min={1} placeholder="Guest count" value={form.guestCount} onChange={(e) => setForm((f) => ({ ...f, guestCount: e.target.value }))} className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setModalDate(null)} className="rounded-full border border-ink-900/15 px-4 py-2 text-xs">Cancel</button>
              <button type="submit" className="rounded-full bg-brass-500 px-4 py-2 text-xs font-medium text-ink-900">Create</button>
            </div>
          </form>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-6">
          <div className="w-full max-w-sm rounded-lg bg-beige-100 p-6 shadow-xl">
            <h3 className="mb-1 font-display text-lg italic text-ink-900">{editing.eventName}</h3>
            <p className="mb-4 text-xs text-ink-700/50">{format(new Date(editing.eventDate), "EEEE, MMM d, yyyy")}</p>
            <div className="space-y-1.5 text-sm text-ink-700/80">
              <p>{editing.eventType}{editing.guestCount ? ` · ${editing.guestCount} guests` : ""}</p>
              {editing.location && <p>{editing.location}</p>}
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-700/50">Status</label>
              <select
                value={editing.status}
                onChange={(e) => updateStatus(editing.id, e.target.value)}
                className="w-full rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
              >
                {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setEditing(null)} className="rounded-full border border-ink-900/15 px-4 py-2 text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
