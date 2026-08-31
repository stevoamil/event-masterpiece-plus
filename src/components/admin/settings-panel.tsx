"use client";

import { useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";

export type UserDTO = { id: string; name: string; email: string; role: string };
export type IntegrationStatus = { gemini: boolean; whatsapp: boolean; resend: boolean };

const ROLES = ["ADMIN", "STAFF"];

export default function SettingsPanel({
  users: initialUsers,
  integrations,
  initialKnowledgeBase,
  initialEmailNotifications,
  currentUserId,
  currentUserRole,
}: {
  users: UserDTO[];
  integrations: IntegrationStatus;
  initialKnowledgeBase: string;
  initialEmailNotifications: boolean;
  currentUserId: string;
  currentUserRole: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [knowledgeBase, setKnowledgeBase] = useState(initialKnowledgeBase);
  const [kbSaved, setKbSaved] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(initialEmailNotifications);
  const [showNewMember, setShowNewMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [memberError, setMemberError] = useState("");
  const isAdmin = currentUserRole === "ADMIN";

  const saveSetting = async (key: string, value: string) => {
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  };

  const saveKnowledgeBase = async () => {
    await saveSetting("ai_knowledge_base", knowledgeBase);
    setKbSaved(true);
    setTimeout(() => setKbSaved(false), 2000);
  };

  const toggleNotifications = async () => {
    const next = !emailNotifications;
    setEmailNotifications(next);
    await saveSetting("email_notifications", String(next));
  };

  const createMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberForm),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setMemberError(data?.error ?? "Something went wrong.");
      return;
    }
    setUsers((prev) => [...prev, data]);
    setMemberForm({ name: "", email: "", password: "", role: "STAFF" });
    setShowNewMember(false);
  };

  const updateRole = async (id: string, role: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  };

  const removeMember = async (id: string, name: string) => {
    if (!window.confirm(`Remove "${name}" from the team? They'll lose access to this dashboard immediately.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      window.alert(data?.error ?? "Couldn't remove this team member.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-medium text-ink-900">Team Members</p>
          {isAdmin && (
            <button
              onClick={() => setShowNewMember(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-ink-900/15 hover:border-brass-500"
              aria-label="Add team member"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mb-4 text-xs text-ink-700/50">Roles and permissions for people who can access this dashboard.</p>
        <div className="overflow-hidden rounded-md border border-ink-900/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 bg-beige-50 text-xs uppercase tracking-wide text-ink-700/50">
                {isAdmin && <th className="w-10 px-4 py-2.5" />}
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink-900/5 last:border-0">
                  {isAdmin && (
                    <td className="px-4 py-2.5">
                      {u.id !== currentUserId && (
                        <button
                          onClick={() => removeMember(u.id, u.name)}
                          aria-label={`Remove ${u.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-ink-700/30 transition hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-2.5">
                    {u.name}
                    {u.id === currentUserId && <span className="ml-1.5 text-xs text-ink-700/40">(you)</span>}
                  </td>
                  <td className="px-4 py-2.5 text-ink-700/70">{u.email}</td>
                  <td className="px-4 py-2.5">
                    {isAdmin ? (
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        disabled={u.id === currentUserId}
                        className="rounded-full border-0 bg-brass-500/10 px-2.5 py-1 text-xs text-brass-500 focus:outline-none disabled:opacity-60"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r} className="bg-beige-100 text-ink-900">
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="rounded-full bg-brass-500/10 px-2.5 py-1 text-xs text-brass-500">{u.role}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
        <p className="mb-1 text-sm font-medium text-ink-900">AI Assistant Knowledge Base</p>
        <p className="mb-4 text-xs text-ink-700/50">
          Extra notes appended to the concierge&apos;s instructions — current promotions, seasonal availability, updated pricing, etc.
        </p>
        <textarea
          rows={5}
          value={knowledgeBase}
          onChange={(e) => setKnowledgeBase(e.target.value)}
          placeholder="e.g. We are fully booked for weddings in June 2026. Spring 2027 packages now open."
          className="w-full rounded border border-ink-900/15 bg-beige-50 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
        />
        <div className="mt-3 flex items-center gap-3">
          <button onClick={saveKnowledgeBase} className="rounded-full bg-brass-500 px-4 py-2 text-xs font-medium text-ink-900">
            Save
          </button>
          {kbSaved && <span className="text-xs text-brass-500">Saved.</span>}
        </div>
      </section>

      <section className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
        <p className="mb-1 text-sm font-medium text-ink-900">Notification Preferences</p>
        <div className="mt-3 flex items-center justify-between rounded border border-ink-900/10 px-4 py-3">
          <div>
            <p className="text-sm text-ink-900">Email me when a consultation is booked</p>
            <p className="text-xs text-ink-700/50">
              Notify the team by email when the AI concierge books a consultation. Requires the Resend integration below.
            </p>
          </div>
          <button
            onClick={toggleNotifications}
            className={`h-6 w-11 rounded-full transition-colors ${emailNotifications ? "bg-brass-500" : "bg-ink-900/15"}`}
          >
            <span
              className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${
                emailNotifications ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
        <p className="mb-1 text-sm font-medium text-ink-900">Integration Keys</p>
        <p className="mb-4 text-xs text-ink-700/50">
          Configured via environment variables (<code>.env</code>) — not editable here for security.
        </p>
        <div className="space-y-2">
          <IntegrationRow label="Gemini API (AI Assistant)" connected={integrations.gemini} />
          <IntegrationRow label="WhatsApp Business API" connected={integrations.whatsapp} />
          <IntegrationRow label="Resend (Email Notifications)" connected={integrations.resend} />
        </div>
      </section>

      {showNewMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-6">
          <form onSubmit={createMember} className="w-full max-w-sm rounded-lg bg-beige-100 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg italic text-ink-900">New Team Member</h3>
              <button type="button" onClick={() => setShowNewMember(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <input
                required
                placeholder="Name"
                value={memberForm.name}
                onChange={(e) => setMemberForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={memberForm.email}
                onChange={(e) => setMemberForm((f) => ({ ...f, email: e.target.value }))}
                className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
              />
              <input
                required
                type="password"
                placeholder="Password (min. 8 characters)"
                minLength={8}
                value={memberForm.password}
                onChange={(e) => setMemberForm((f) => ({ ...f, password: e.target.value }))}
                className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
              />
              <select
                value={memberForm.role}
                onChange={(e) => setMemberForm((f) => ({ ...f, role: e.target.value }))}
                className="rounded border border-ink-900/15 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {memberError && <p className="text-xs text-red-500">{memberError}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowNewMember(false)} className="rounded-full border border-ink-900/15 px-4 py-2 text-xs">
                Cancel
              </button>
              <button type="submit" className="rounded-full bg-brass-500 px-4 py-2 text-xs font-medium text-ink-900">
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function IntegrationRow({ label, connected }: { label: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between rounded border border-ink-900/10 px-4 py-3 text-sm">
      <span className="text-ink-900">{label}</span>
      {connected ? (
        <span className="flex items-center gap-1 text-xs text-emerald-600">
          <Check className="h-3.5 w-3.5" /> Connected
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-ink-700/40">
          <X className="h-3.5 w-3.5" /> Not configured
        </span>
      )}
    </div>
  );
}
