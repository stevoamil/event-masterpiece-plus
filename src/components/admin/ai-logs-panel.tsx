"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Flag, MessageSquareWarning, Trash2 } from "lucide-react";

export type ChatSessionDTO = {
  sessionId: string;
  leadName: string | null;
  flagged: boolean;
  lastMessageAt: string;
  messages: { id: string; role: string; content: string; createdAt: string }[];
};

export default function AiLogsPanel({ sessions: initial }: { sessions: ChatSessionDTO[] }) {
  const [sessions, setSessions] = useState(initial);
  const [selected, setSelected] = useState<string | null>(initial[0]?.sessionId ?? null);

  const active = sessions.find((s) => s.sessionId === selected);

  const toggleFlag = async (sessionId: string, flagged: boolean) => {
    setSessions((prev) => prev.map((s) => (s.sessionId === sessionId ? { ...s, flagged } : s)));
    await fetch("/api/admin/chat-logs/flag", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, flagged }),
    });
  };

  const removeSession = async (sessionId: string, name: string) => {
    if (!window.confirm(`Delete this conversation with "${name}"? This cannot be undone.`)) return;
    setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    setSelected((s) => (s === sessionId ? null : s));
    await fetch(`/api/admin/chat-logs/${sessionId}`, { method: "DELETE" });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-ink-900/10 bg-beige-100 lg:col-span-1">
        <p className="border-b border-ink-900/10 px-4 py-3 text-sm font-medium text-ink-900">
          Conversations ({sessions.length})
        </p>
        <div className="max-h-[560px] overflow-y-auto">
          {sessions.map((s) => (
            <div
              key={s.sessionId}
              className={`flex items-center border-b border-ink-900/5 ${selected === s.sessionId ? "bg-brass-500/10" : ""}`}
            >
              <button
                onClick={() => removeSession(s.sessionId, s.leadName ?? "Anonymous visitor")}
                aria-label={`Delete conversation with ${s.leadName ?? "Anonymous visitor"}`}
                className="ml-2 flex h-7 w-7 flex-none items-center justify-center rounded-full text-ink-700/30 transition hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setSelected(s.sessionId)}
                className="flex min-w-0 flex-1 items-start justify-between gap-2 px-3 py-3 text-left text-sm hover:bg-ink-900/[0.02]"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-900">{s.leadName ?? "Anonymous visitor"}</p>
                  <p className="truncate text-xs text-ink-700/50">{format(new Date(s.lastMessageAt), "MMM d, HH:mm")}</p>
                </div>
                {s.flagged && <Flag className="h-3.5 w-3.5 flex-shrink-0 fill-red-400 text-red-400" />}
              </button>
            </div>
          ))}
          {sessions.length === 0 && <p className="px-4 py-6 text-center text-sm text-ink-700/50">No conversations yet.</p>}
        </div>
      </div>

      <div className="rounded-lg border border-ink-900/10 bg-beige-100 p-5 lg:col-span-2">
        {!active ? (
          <p className="text-sm text-ink-700/50">Select a conversation.</p>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg italic text-ink-900">{active.leadName ?? "Anonymous visitor"}</h3>
              <button
                onClick={() => toggleFlag(active.sessionId, !active.flagged)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${
                  active.flagged ? "border-red-400 bg-red-400/10 text-red-500" : "border-ink-900/15 text-ink-700/60"
                }`}
              >
                <MessageSquareWarning className="h-3.5 w-3.5" />
                {active.flagged ? "Flagged for follow-up" : "Flag for follow-up"}
              </button>
            </div>
            <div className="max-h-[480px] space-y-3 overflow-y-auto">
              {active.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm ${
                    m.role === "user" ? "ml-auto bg-ink-900 text-beige-100" : "bg-beige-200/70 text-ink-900"
                  }`}
                >
                  {m.content}
                  <p className="mt-1 text-[10px] opacity-50">{format(new Date(m.createdAt), "HH:mm")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
