"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

export type Card =
  | { type: "services"; items: { slug: string; name: string; desc: string; image: string }[] }
  | { type: "portfolio"; items: { id: string; title: string; category: string; imageUrl: string }[] }
  | { type: "slots"; days: { date: string; times: string[] }[]; selected?: { date: string; time: string } }
  | { type: "confirmation"; date: string; time: string; eventType: string | null };

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-beige-100 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-900/40"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function ServiceCards({ items }: { items: { slug: string; name: string; desc: string; image: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="hide-scrollbar mt-2 flex gap-3 overflow-x-auto pb-1">
      {items.map((s) => (
        <Link
          key={s.slug}
          href={`/services/${s.slug}`}
          data-cursor-hover
          className="group block w-44 flex-shrink-0 overflow-hidden rounded-xl border border-ink-900/10 bg-white"
        >
          <div className="relative h-28 w-full bg-beige-100">
            <Image src={s.image} alt={s.name} fill sizes="176px" className="object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-ink-900">{s.name}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-ink-700/60">{s.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PortfolioCards({ items }: { items: { id: string; title: string; category: string; imageUrl: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="hide-scrollbar mt-2 flex gap-3 overflow-x-auto pb-1">
      {items.map((p) => (
        <div key={p.id} className="w-36 flex-shrink-0 overflow-hidden rounded-xl border border-ink-900/10 bg-white">
          <div className="relative h-28 w-full bg-beige-100">
            <Image src={p.imageUrl} alt={p.title} fill sizes="144px" className="object-cover" />
          </div>
          <div className="p-2.5">
            <p className="line-clamp-1 text-xs font-medium text-ink-900">{p.title}</p>
            <p className="text-[11px] text-ink-700/50">{p.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function formatSlotDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
export function formatSlotTime(dateStr: string, time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(h, m);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function SlotPicker({
  days,
  selected,
  onSelect,
}: {
  days: { date: string; times: string[] }[];
  selected?: { date: string; time: string };
  onSelect: (label: string, date: string, time: string) => void;
}) {
  const [activeDate, setActiveDate] = useState<string | null>(days[0]?.date ?? null);

  if (days.length === 0) {
    return <p className="mt-2 text-sm text-ink-700/50">No openings found in that window — our team can confirm alternatives.</p>;
  }

  // Once this specific picker's slot has been chosen, collapse it to a static summary
  // instead of leaving a full, still-tappable grid of dates/times sitting in the
  // conversation after the flow has already moved on to collecting contact details.
  if (selected) {
    return (
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-brass-500/40 bg-brass-500/10 px-4 py-2 text-sm font-medium text-ink-900">
        <Check className="h-4 w-4 text-brass-500" />
        {formatSlotDate(selected.date)} at {formatSlotTime(selected.date, selected.time)}
      </div>
    );
  }

  const active = days.find((d) => d.date === activeDate) ?? days[0];

  return (
    <div className="mt-3 space-y-2.5">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d.date}
            type="button"
            data-cursor-hover
            onClick={() => setActiveDate(d.date)}
            className={`flex-shrink-0 rounded-full border px-3.5 py-2 text-sm transition ${
              d.date === active.date ? "border-ink-900 bg-ink-900 text-beige-50" : "border-ink-900/15 text-ink-700/70"
            }`}
          >
            {formatSlotDate(d.date)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {active.times.map((t) => (
          <button
            key={t}
            type="button"
            data-cursor-hover
            onClick={() => onSelect(`${formatSlotDate(active.date)} at ${formatSlotTime(active.date, t)}`, active.date, t)}
            className="rounded-full border border-brass-500/50 px-3.5 py-2 text-sm font-medium text-brass-500 transition hover:bg-brass-500 hover:text-ink-900"
          >
            {formatSlotTime(active.date, t)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BookingConfirmationCard({ date, time }: { date: string; time: string }) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(`${date}T00:00:00`);
  d.setHours(h, m);
  const formatted = `${d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at ${d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  return (
    <div className="mt-3 rounded-2xl border border-brass-500/30 bg-brass-500/5 p-5 text-center">
      <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brass-500/15">
        <Check className="h-6 w-6 text-brass-500" />
      </div>
      <p className="mt-3 text-base font-medium text-ink-900">Your consultation is confirmed ✨</p>
      <p className="mt-1 text-sm text-ink-700/70">{formatted}</p>
      <p className="mt-2 text-sm text-ink-700/60">Thank you for choosing Event Masterpiece Plus. 🤍</p>
    </div>
  );
}
