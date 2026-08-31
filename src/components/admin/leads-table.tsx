"use client";

import { Fragment, useMemo, useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { LEAD_STATUSES, LEAD_STATUS_COLORS } from "@/lib/lead-status";

export type LeadDTO = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  eventType: string | null;
  eventDate: string | null;
  guestCount: number | null;
  location: string | null;
  budgetRange: string | null;
  message: string | null;
  source: string;
  status: string;
  createdAt: string;
};

const STATUSES = LEAD_STATUSES;
const STATUS_COLORS = LEAD_STATUS_COLORS;

export default function LeadsTable({ leads: initialLeads }: { leads: LeadDTO[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
      if (query && !`${l.name} ${l.email ?? ""} ${l.eventType ?? ""}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [leads, statusFilter, query]);

  const updateStatus = async (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const removeLead = async (id: string, name: string) => {
    if (!window.confirm(`Delete the lead "${name}"? This also removes its chat history and any consultation.`)) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setExpanded((e) => (e === id ? null : e));
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
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
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink-900/10 bg-beige-100">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/10 text-xs uppercase tracking-wide text-ink-700/50">
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <Fragment key={lead.id}>
                <tr
                  onClick={() => setExpanded((e) => (e === lead.id ? null : lead.id))}
                  className="cursor-pointer border-b border-ink-900/5 last:border-0 hover:bg-ink-900/[0.02]"
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => removeLead(lead.id, lead.name)}
                      aria-label={`Delete ${lead.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-ink-700/30 transition hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-900">{lead.name}</td>
                  <td className="px-4 py-3 text-ink-700/70">{lead.email ?? lead.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-700/70">
                    {lead.eventType ?? "—"}
                    {lead.guestCount ? ` · ${lead.guestCount} guests` : ""}
                  </td>
                  <td className="px-4 py-3 text-ink-700/70">{lead.source.replace("_", " ")}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs focus:outline-none ${STATUS_COLORS[lead.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-beige-100 text-ink-900">
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-ink-700/70">{format(new Date(lead.createdAt), "MMM d, yyyy")}</td>
                </tr>
                {expanded === lead.id && (
                  <tr className="border-b border-ink-900/5 bg-ink-900/[0.015]">
                    <td colSpan={7} className="px-4 py-4 text-xs text-ink-700/80">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <p><span className="text-ink-700/40">Budget:</span> {lead.budgetRange ?? "—"}</p>
                        <p><span className="text-ink-700/40">Event date:</span> {lead.eventDate ? format(new Date(lead.eventDate), "MMM d, yyyy") : "—"}</p>
                        <p><span className="text-ink-700/40">Location:</span> {lead.location ?? "—"}</p>
                        <p><span className="text-ink-700/40">Phone:</span> {lead.phone ?? "—"}</p>
                        <p><span className="text-ink-700/40">Email:</span> {lead.email ?? "—"}</p>
                      </div>
                      {lead.message && <p className="mt-3"><span className="text-ink-700/40">Message:</span> {lead.message}</p>}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-ink-700/50">
                  No leads match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
