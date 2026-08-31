"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, X } from "lucide-react";

export type ClientDTO = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  bookings: { id: string; eventName: string; eventDate: string; status: string }[];
};

export default function ClientsPanel({ clients: initial }: { clients: ClientDTO[] }) {
  const [clients, setClients] = useState(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const active = clients.find((c) => c.id === selected);

  const createClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setClients((prev) => [{ ...created, bookings: [] }, ...prev]);
      setForm({ name: "", email: "", phone: "" });
      setShowNew(false);
    }
  };

  const saveNotes = async () => {
    if (!active) return;
    await fetch(`/api/admin/clients/${active.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: notesDraft }),
    });
    setClients((prev) => prev.map((c) => (c.id === active.id ? { ...c, notes: notesDraft } : c)));
  };

  const removeClient = async (id: string, name: string) => {
    if (!window.confirm(`Delete the client "${name}"? Their past bookings are kept but unlinked.`)) return;
    setClients((prev) => prev.filter((c) => c.id !== id));
    setSelected((s) => (s === id ? null : s));
    await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-ink-900/10 bg-beige-100 lg:col-span-1">
        <div className="flex items-center justify-between border-b border-ink-900/10 px-4 py-3">
          <p className="text-sm font-medium text-ink-900">Clients ({clients.length})</p>
          <button onClick={() => setShowNew(true)} className="flex h-7 w-7 items-center justify-center rounded-full border border-ink-900/15 hover:border-brass-500">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="max-h-[560px] overflow-y-auto">
          {clients.map((c) => (
            <div
              key={c.id}
              className={`flex items-center border-b border-ink-900/5 ${selected === c.id ? "bg-brass-500/10" : ""}`}
            >
              <button
                onClick={() => removeClient(c.id, c.name)}
                aria-label={`Delete ${c.name}`}
                className="ml-2 flex h-7 w-7 flex-none items-center justify-center rounded-full text-ink-700/30 transition hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  setSelected(c.id);
                  setNotesDraft(c.notes ?? "");
                }}
                className="min-w-0 flex-1 px-3 py-3 text-left text-sm hover:bg-ink-900/[0.02]"
              >
                <p className="truncate font-medium text-ink-900">{c.name}</p>
                <p className="truncate text-xs text-ink-700/50">{c.email ?? c.phone ?? "No contact info"}</p>
              </button>
            </div>
          ))}
          {clients.length === 0 && <p className="px-4 py-6 text-center text-sm text-ink-700/50">No clients yet.</p>}
        </div>
      </div>

      <div className="rounded-lg border border-ink-900/10 bg-beige-100 p-5 lg:col-span-2">
        {!active ? (
          <p className="text-sm text-ink-700/50">Select a client to view details.</p>
        ) : (
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl italic text-ink-900">{active.name}</h3>
                <p className="text-xs text-ink-700/50">Client since {format(new Date(active.createdAt), "MMM yyyy")}</p>
              </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
              <p><span className="text-ink-700/40">Email:</span> {active.email ?? "—"}</p>
              <p><span className="text-ink-700/40">Phone:</span> {active.phone ?? "—"}</p>
            </div>

            <p className="mb-2 text-xs uppercase tracking-wide text-ink-700/50">Event history</p>
            <div className="mb-6 space-y-2">
              {active.bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded border border-ink-900/10 px-3 py-2 text-sm">
                  <span>{b.eventName}</span>
                  <span className="text-xs text-ink-700/50">{format(new Date(b.eventDate), "MMM d, yyyy")} · {b.status}</span>
                </div>
              ))}
              {active.bookings.length === 0 && <p className="text-sm text-ink-700/40">No bookings yet.</p>}
            </div>

            <p className="mb-2 text-xs uppercase tracking-wide text-ink-700/50">Notes</p>
            <textarea
              rows={4}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={saveNotes}
              placeholder="Internal notes, preferences, contract details…"
              className="w-full rounded border border-ink-900/15 bg-beige-50 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-6">
          <form onSubmit={createClient} className="w-full max-w-sm rounded-lg bg-beige-100 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg italic text-ink-900">New Client</h3>
              <button type="button" onClick={() => setShowNew(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none" />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowNew(false)} className="rounded-full border border-ink-900/15 px-4 py-2 text-xs">Cancel</button>
              <button type="submit" className="rounded-full bg-brass-500 px-4 py-2 text-xs font-medium text-ink-900">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
