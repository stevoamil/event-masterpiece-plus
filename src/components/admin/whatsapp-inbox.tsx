"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Send, Trash2 } from "lucide-react";

export type WaMessageDTO = { id: string; direction: string; body: string; createdAt: string };
export type WaConversationDTO = { waId: string; fromName: string | null; lastAt: string; messages: WaMessageDTO[] };

export default function WhatsAppInbox({ conversations: initial, liveConnected }: {
  conversations: WaConversationDTO[];
  liveConnected: boolean;
}) {
  const [conversations, setConversations] = useState(initial);
  const [selected, setSelected] = useState<string | null>(initial[0]?.waId ?? null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const active = conversations.find((c) => c.waId === selected);

  const send = async () => {
    if (!active || !draft.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waId: active.waId, message: draft }),
      });
      const data = await res.json();
      setConversations((prev) =>
        prev.map((c) =>
          c.waId === active.waId
            ? { ...c, messages: [...c.messages, { id: data.id, direction: "out", body: draft, createdAt: data.createdAt }] }
            : c
        )
      );
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  const removeConversation = async (waId: string, name: string) => {
    if (!window.confirm(`Delete the WhatsApp conversation with "${name}"? This cannot be undone.`)) return;
    setConversations((prev) => prev.filter((c) => c.waId !== waId));
    setSelected((s) => (s === waId ? null : s));
    await fetch(`/api/admin/whatsapp/${waId}`, { method: "DELETE" });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-ink-900/10 bg-beige-100 lg:col-span-1">
        <p className="border-b border-ink-900/10 px-4 py-3 text-sm font-medium text-ink-900">
          Conversations ({conversations.length})
        </p>
        <div className="max-h-[520px] overflow-y-auto">
          {conversations.map((c) => (
            <div
              key={c.waId}
              className={`flex items-center border-b border-ink-900/5 ${selected === c.waId ? "bg-brass-500/10" : ""}`}
            >
              <button
                onClick={() => removeConversation(c.waId, c.fromName ?? c.waId)}
                aria-label={`Delete conversation with ${c.fromName ?? c.waId}`}
                className="ml-2 flex h-7 w-7 flex-none items-center justify-center rounded-full text-ink-700/30 transition hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setSelected(c.waId)}
                className="min-w-0 flex-1 px-3 py-3 text-left text-sm hover:bg-ink-900/[0.02]"
              >
                <p className="truncate font-medium text-ink-900">{c.fromName ?? c.waId}</p>
                <p className="truncate text-xs text-ink-700/50">{c.messages[c.messages.length - 1]?.body}</p>
              </button>
            </div>
          ))}
          {conversations.length === 0 && <p className="px-4 py-6 text-center text-sm text-ink-700/50">No WhatsApp messages yet.</p>}
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-ink-900/10 bg-beige-100 p-5 lg:col-span-2">
        {!active ? (
          <p className="text-sm text-ink-700/50">Select a conversation.</p>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg italic text-ink-900">{active.fromName ?? active.waId}</h3>
              {!liveConnected && (
                <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-amber-600">
                  Not connected — replies save locally only
                </span>
              )}
            </div>
            <div className="mb-4 max-h-[380px] flex-1 space-y-2 overflow-y-auto">
              {active.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm ${
                    m.direction === "out" ? "ml-auto bg-ink-900 text-beige-100" : "bg-beige-200/70 text-ink-900"
                  }`}
                >
                  {m.body}
                  <p className="mt-1 text-[10px] opacity-50">{format(new Date(m.createdAt), "MMM d, HH:mm")}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a reply…"
                className="flex-1 rounded-full border border-ink-900/15 bg-beige-50 px-4 py-2 text-sm focus:border-brass-500 focus:outline-none"
              />
              <button onClick={send} disabled={sending} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-beige-100 disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
