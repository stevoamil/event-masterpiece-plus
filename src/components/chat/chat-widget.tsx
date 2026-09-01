"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Mic, MessageCircleMore, ChevronUp, ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  BookingConfirmationCard,
  PortfolioCards,
  ServiceCards,
  SlotPicker,
  TypingIndicator,
  type Card,
} from "./chat-message-parts";

// Rendered in a 3-column grid, so this fixes the reading order to
// [Plan My Event, Explore Services, Weddings] / [View Portfolio, Check
// Availability, Corporate Events] rather than the dictionary's declaration order.
const QUICK_ACTION_ORDER = [
  "planEvent",
  "exploreServices",
  "weddings",
  "viewPortfolio",
  "checkAvailability",
  "corporateEvents",
] as const;

interface Message {
  from: "user" | "bot";
  text: string;
  time: string;
  cards?: Card[];
  showQuickActions?: boolean;
  // The seeded welcome message re-renders from the current dictionary instead of a
  // fixed string, since it mounts before the locale-context effect resolves the
  // visitor's saved language (see rendering below).
  isGreeting?: boolean;
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = window.sessionStorage.getItem("mm_chat_session");
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem("mm_chat_session", id);
  }
  return id;
}

// The Web Speech API isn't part of TS's DOM lib — narrow just enough of it to use safely.
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => SpeechRecognitionLike) | null;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const { dict, locale } = useLocale();
  const [open, setOpen] = useState(false);
  // Only ever rendered once `open` is true (a real click), so seeding it here
  // doesn't risk a hydration mismatch even though `timeNow()` isn't SSR-stable.
  const [messages, setMessages] = useState<Message[]>(() => [
    { from: "bot", text: "", time: timeNow(), showQuickActions: true, isGreeting: true },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [leadId, setLeadId] = useState<string | undefined>(() =>
    typeof window === "undefined" ? undefined : window.sessionStorage.getItem("mm_chat_lead") || undefined
  );
  // The exact slot the customer just tapped in the SlotPicker (as opposed to the
  // human-readable label sent as the chat message) — resent on every turn until the
  // booking is confirmed, so the assistant never has to re-derive or re-ask for it.
  const [pendingSlot, setPendingSlot] = useState<{ date: string; time: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  // Only used inside the `open` panel, which starts closed — so this can't affect the
  // server-rendered/hydrated output and is safe to compute in a lazy initializer.
  const [speechSupported] = useState(() => !!getSpeechRecognition());

  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("mm:open-chat", openChat);
    return () => window.removeEventListener("mm:open-chat", openChat);
  }, []);

  // Follow new messages to the bottom, but never fight the visitor if they've
  // scrolled up to reread earlier messages — only auto-follow when they were
  // already near the bottom, or when it's their own message being sent.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const lastMessage = messages[messages.length - 1];
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (lastMessage?.from === "user" || nearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, sending]);

  if (pathname?.startsWith("/admin")) return null;

  function scrollByAmount(delta: number) {
    scrollRef.current?.scrollBy({ top: delta, behavior: "smooth" });
  }

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Recognition = getSpeechRecognition();
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = locale === "fr" ? "fr-FR" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ");
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  async function sendMessage(text: string, slot?: { date: string; time: string }) {
    const value = text.trim();
    if (!value || sending) return;

    // Claude's API requires the conversation to start with a "user" message — drop the
    // locally-seeded welcome greeting (and anything before the first real user turn).
    const firstUserIdx = messages.findIndex((m) => m.from === "user");
    const history = (firstUserIdx === -1 ? [] : messages.slice(firstUserIdx))
      .filter((m) => m.text)
      .slice(-10)
      .map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text }));

    // `slot` (passed directly by the slot picker) takes priority over `pendingSlot`
    // state so the very click that sets it doesn't lose it to React's async setState.
    const effectiveSlot = slot ?? pendingSlot;

    setMessages((m) => [...m, { from: "user", text: value, time: timeNow() }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          message: value,
          history,
          locale,
          leadId,
          pendingSlot: effectiveSlot ?? undefined,
        }),
      });
      const data = await res.json();

      if (data.leadId && data.leadId !== leadId) {
        setLeadId(data.leadId);
        window.sessionStorage.setItem("mm_chat_lead", data.leadId);
      }

      const cards = Array.isArray(data.cards) ? data.cards : undefined;
      // Once the booking is actually confirmed, the chosen slot no longer needs to be
      // resent — clear it so a later, unrelated conversation doesn't reuse a stale slot.
      if (cards?.some((c: Card) => c.type === "confirmation")) {
        setPendingSlot(null);
      }

      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: data.reply ?? dict.chat.defaultReply,
          time: timeNow(),
          cards,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: dict.chat.connectionError,
          time: timeNow(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSend() {
    sendMessage(input);
  }

  return (
    <>
      {!open && (
        <button
          data-cursor-hover
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-brass-400 shadow-xl shadow-black/30 sm:bottom-28 sm:right-8"
          aria-label={dict.chat.cta}
          title={dict.chat.cta}
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-2 right-4 z-[70] h-[min(900px,calc(100vh-56px))] w-[90vw] max-w-[400px] rounded-[1.75rem] bg-gradient-to-br from-brass-400/40 via-ink-900/10 to-transparent p-[1px] shadow-2xl shadow-black/30 sm:bottom-4 sm:right-8"
          >
            <div data-lenis-prevent className="flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-1px)] border border-ink-900/5 bg-beige-50">
              <div className="flex items-center gap-3.5 bg-ink-900 px-6 py-5 text-beige-50">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-br from-brass-400/30 to-brass-500/10 text-brass-400">
                  <MessageCircleMore className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base italic leading-none">{dict.chat.title}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-beige-50/50">
                    <span className="relative flex h-1.5 w-1.5 flex-none">
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    {dict.chat.subtitle}
                  </div>
                </div>
                <button
                  type="button"
                  data-cursor-hover
                  onClick={() => setOpen(false)}
                  aria-label={dict.chat.closeChat}
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-beige-50/60 transition hover:bg-white/10 hover:text-beige-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex min-h-0 flex-1">
                <div ref={scrollRef} data-lenis-prevent className="min-w-0 flex-1 space-y-5 overflow-y-auto px-5 py-6">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-[92%] rounded-[1.4rem] px-5 py-3.5 text-[13px] leading-relaxed shadow-sm ${
                          m.from === "user"
                            ? "rounded-br-md bg-brass-500 text-ink-900"
                            : "rounded-bl-md border border-ink-900/5 bg-white text-ink-900"
                        }`}
                      >
                        {m.isGreeting ? dict.chat.greeting : m.text}
                      </div>

                      {m.showQuickActions && (
                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                          {QUICK_ACTION_ORDER.map((key) => (
                            <button
                              key={key}
                              data-cursor-hover
                              onClick={() => sendMessage(dict.chat.quickActions[key])}
                              className="rounded-full border border-brass-500/50 px-2 py-1.5 text-center text-[10px] font-medium leading-tight text-brass-500 transition hover:bg-brass-500 hover:text-ink-900"
                            >
                              {dict.chat.quickActions[key]}
                            </button>
                          ))}
                        </div>
                      )}

                      {m.cards?.map((card, ci) => {
                        if (card.type === "services") return <ServiceCards key={ci} items={card.items} />;
                        if (card.type === "portfolio") return <PortfolioCards key={ci} items={card.items} />;
                        if (card.type === "slots")
                          return (
                            <SlotPicker
                              key={ci}
                              days={card.days}
                              selected={card.selected}
                              onSelect={(label, date, time) => {
                                setPendingSlot({ date, time });
                                // Collapse this specific card to a static summary so it
                                // doesn't linger as a full, still-tappable slot grid once
                                // the conversation has moved on to contact details.
                                setMessages((msgs) =>
                                  msgs.map((msg, mi) =>
                                    mi !== i
                                      ? msg
                                      : {
                                          ...msg,
                                          cards: msg.cards?.map((c, cix) =>
                                            cix !== ci ? c : { ...c, selected: { date, time } }
                                          ),
                                        }
                                  )
                                );
                                sendMessage(label, { date, time });
                              }}
                            />
                          );
                        if (card.type === "confirmation") return <BookingConfirmationCard key={ci} date={card.date} time={card.time} />;
                        return null;
                      })}
                    </div>
                  ))}
                  {sending && (
                    <div className="flex flex-col items-start">
                      <TypingIndicator />
                    </div>
                  )}
                </div>

                <div className="flex w-10 flex-none flex-col items-center justify-center gap-2 border-l border-ink-900/5">
                  <button
                    type="button"
                    data-cursor-hover
                    onClick={() => scrollByAmount(-200)}
                    aria-label={dict.chat.scrollUp}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700/40 transition hover:bg-ink-900/5 hover:text-brass-500"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    data-cursor-hover
                    onClick={() => scrollByAmount(200)}
                    aria-label={dict.chat.scrollDown}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700/40 transition hover:bg-ink-900/5 hover:text-brass-500"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="border-t border-ink-900/10 px-5 pt-4">
                <div className="flex items-center gap-2 rounded-full border border-ink-900/15 bg-white py-2 pl-5 pr-2 transition focus-within:border-brass-500">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={listening ? dict.chat.listening : dict.chat.placeholder}
                    className="min-w-0 flex-1 bg-transparent py-1.5 text-[13px] outline-none"
                  />
                  {speechSupported && (
                    <button
                      type="button"
                      data-cursor-hover
                      onClick={toggleListening}
                      aria-label={listening ? dict.chat.stopVoice : dict.chat.startVoice}
                      className={`relative flex h-10 w-10 flex-none items-center justify-center rounded-full transition ${
                        listening ? "bg-red-500 text-white" : "text-ink-700/50 hover:bg-ink-900/5 hover:text-brass-500"
                      }`}
                    >
                      {listening && <span className="animate-pulse-ring absolute inset-0 rounded-full bg-red-500" />}
                      <Mic className="relative h-[18px] w-[18px]" />
                    </button>
                  )}
                  <button
                    data-cursor-hover
                    onClick={handleSend}
                    disabled={sending}
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink-900 text-brass-400 transition hover:bg-brass-500 hover:text-ink-900 disabled:opacity-50"
                    aria-label={dict.chat.sendMessage}
                  >
                    <Send className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </div>
              <div className="h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
