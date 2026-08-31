"use client";

import { Fragment, useMemo, useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

export type ConsultationDTO = {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail: string | null;
  leadPhone: string | null;
  eventType: string | null;
  date: string;
  duration: number;
  status: string;
  notes: string | null;
  createdAt: string;
};

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  CONFIRMED: "bg-brass-500/10 text-brass-500",
  CANCELLED: "bg-ink-900/10 text-ink-700/50",
  COMPLETED: "bg-emerald-500/10 text-emerald-600",
};

export default function ConsultationsTable({ consultations: initial }: { consultations: ConsultationDTO[] }) {
  const [consultations, setConsultations] = useState(initial);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return consultations.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (query && !`${c.leadName} ${c.leadEmail ?? ""} ${c.eventType ?? ""}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [consultations, statusFilter, query]);

  const updateStatus = async (id: string, status: string) => {
    setConsultations((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const removeConsultation = async (id: string, name: string) => {
    if (!window.confirm(`Delete the consultation with "${name}"?`)) return;
    setConsultations((prev) => prev.filter((c) => c.id !== id));
    setExpanded((e) => (e === id ? null : e));
    await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          placeholder="Search name, email, event type…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xs rounded-md border border-ink-900/15 bg-beige-100 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
        />
        <div className="flex flex-wrap gap-1.5">
          {["ALL", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                statusFilter === s ? "border-ink-900 bg-ink-900 text-beige-100" : "border-ink-900/15 text-ink-700/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink-900/10 bg-beige-100">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/10 text-xs uppercase tracking-wide text-ink-700/50">
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Booked</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <Fragment key={c.id}>
                <tr
                  onClick={() => setExpanded((e) => (e === c.id ? null : c.id))}
                  className="cursor-pointer border-b border-ink-900/5 last:border-0 hover:bg-ink-900/[0.02]"
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => removeConsultation(c.id, c.leadName)}
                      aria-label={`Delete consultation with ${c.leadName}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-ink-700/30 transition hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-900">{c.leadName}</td>
                  <td className="px-4 py-3 text-ink-700/70">{c.leadEmail ?? c.leadPhone ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-700/70">{c.eventType ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-700/70">{format(new Date(c.date), "EEE, MMM d 'at' h:mm a")}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs focus:outline-none ${STATUS_COLORS[c.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-beige-100 text-ink-900">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-ink-700/70">{format(new Date(c.createdAt), "MMM d, yyyy")}</td>
                </tr>
                {expanded === c.id && (
                  <tr className="border-b border-ink-900/5 bg-ink-900/[0.015]">
                    <td colSpan={7} className="px-4 py-4 text-xs text-ink-700/80">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <p><span className="text-ink-700/40">Duration:</span> {c.duration} min</p>
                        <p><span className="text-ink-700/40">Phone:</span> {c.leadPhone ?? "—"}</p>
                        <p><span className="text-ink-700/40">Email:</span> {c.leadEmail ?? "—"}</p>
                      </div>
                      {c.notes && <p className="mt-3"><span className="text-ink-700/40">Notes:</span> {c.notes}</p>}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-ink-700/50">
                  No consultations match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
