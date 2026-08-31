"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Mail,
  MessageCircle,
  MessageSquare,
  PartyPopper,
  Phone,
  Send,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { eventTypeOptions, budgetOptions } from "@/lib/i18n/dictionaries";
import { getWhatsAppUrl } from "@/components/whatsapp/whatsapp-button";

export default function ContactSection() {
  const { dict, locale } = useLocale();
  const eventTypes = eventTypeOptions[locale];
  const budgets = budgetOptions[locale];
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: eventTypes[0],
    date: "",
    guests: "",
    budget: budgets[0],
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          eventType: form.eventType,
          eventDate: form.date,
          guestCount: form.guests,
          budgetRange: form.budget,
          message: form.message,
          source: "WEBSITE_FORM",
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-ink-900 py-28 text-beige-50 sm:py-40">
      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-6 sm:px-10 lg:grid-cols-2 lg:gap-24">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest2 text-brass-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass-400" />
            {dict.contact.kicker}
          </span>
          <h2 className="mt-4 font-display text-4xl italic leading-tight sm:text-5xl">{dict.contact.title}</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-beige-50/60 sm:text-base">{dict.contact.subtitle}</p>

          <div className="mt-10 space-y-4">
            <p className="flex items-center gap-3 text-xs uppercase tracking-widest2 text-beige-50/35">
              {dict.contact.or}
              <span className="h-px flex-1 bg-white/10" />
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <WhatsAppTile label={dict.contact.whatsapp} />
              <ContactTile icon={Mail} label={dict.contact.email} href="mailto:hello@eventsbymarina.com" />
              <ContactTile icon={Phone} label={dict.contact.call} href="tel:+10000000000" />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] bg-gradient-to-br from-brass-400/40 via-white/10 to-transparent p-[1px]"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-ink-900/95 p-6 backdrop-blur-xl sm:p-10">
            <span className="pointer-events-none absolute left-5 top-5 h-5 w-5 border-l-2 border-t-2 border-brass-400/40" />
            <span className="pointer-events-none absolute bottom-5 right-5 h-5 w-5 border-b-2 border-r-2 border-brass-400/40" />

            {status === "success" ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brass-400/15">
                  <span className="animate-pulse-ring absolute inset-0 rounded-full bg-brass-400/40" />
                  <Send className="relative h-6 w-6 text-brass-400" />
                </div>
                <p className="mt-6 max-w-xs text-sm text-beige-50/80">{dict.contact.form.submitted}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <Field label={dict.contact.form.name} icon={User}>
                  <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
                </Field>
                <Field label={dict.contact.form.email} icon={Mail}>
                  <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                </Field>
                <Field label={dict.contact.form.phone} icon={Phone}>
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                </Field>
                <Field label={dict.contact.form.eventType} icon={PartyPopper}>
                  <select value={form.eventType} onChange={(e) => update("eventType", e.target.value)} className={inputClass}>
                    {eventTypes.map((ev) => (
                      <option key={ev} value={ev} className="text-black">
                        {ev}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={dict.contact.form.date} icon={CalendarDays}>
                  <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass} />
                </Field>
                <Field label={dict.contact.form.guests} icon={Users}>
                  <input type="number" min={1} value={form.guests} onChange={(e) => update("guests", e.target.value)} className={inputClass} />
                </Field>
                <Field label={dict.contact.form.budget} icon={Wallet} full>
                  <select value={form.budget} onChange={(e) => update("budget", e.target.value)} className={inputClass}>
                    {budgets.map((b) => (
                      <option key={b} value={b} className="text-black">
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={dict.contact.form.message} icon={MessageSquare} full iconAlign="top">
                  <textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass} />
                </Field>

                <button
                  type="submit"
                  data-cursor-hover
                  disabled={status === "submitting"}
                  className="group relative col-span-full mt-2 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brass-400 to-brass-500 px-7 py-4 text-xs font-medium uppercase tracking-widest2 text-ink-900 transition hover:brightness-110 disabled:opacity-50"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan-sweep" />
                  <span className="relative">{status === "submitting" ? dict.contact.form.submitting : dict.contact.form.submit}</span>
                  <Send className="relative h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </button>
                {status === "error" && <p className="col-span-full text-sm text-red-400">{dict.contact.form.error}</p>}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WhatsAppTile({ label }: { label: string }) {
  const { dict } = useLocale();
  const href = getWhatsAppUrl(dict.whatsappMessage);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor-hover
      className="group flex items-center gap-3 rounded-2xl border border-[#25D366]/25 bg-white/[0.03] px-5 py-4 transition hover:border-[#25D366]/60 hover:bg-white/[0.06]"
    >
      <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366]">
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25D366]" />
        <MessageCircle className="relative h-4 w-4 text-ink-900" />
      </span>
      <span className="flex-1 text-sm font-medium text-beige-50">{label}</span>
      <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-beige-50/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#25D366]" />
    </a>
  );
}

function ContactTile({ icon: Icon, label, href }: { icon: LucideIcon; label: string; href: string }) {
  return (
    <a
      href={href}
      data-cursor-hover
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-brass-400/50 hover:bg-white/[0.06]"
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-brass-400/30 bg-brass-400/10 text-brass-400">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-sm font-medium text-beige-50">{label}</span>
      <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-beige-50/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brass-400" />
    </a>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-11 pr-4 text-sm text-beige-50 outline-none transition placeholder:text-white/30 focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20";

function Field({
  label,
  children,
  full,
  icon: Icon,
  iconAlign = "center",
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
  icon: LucideIcon;
  iconAlign?: "center" | "top";
}) {
  return (
    <label className={`flex flex-col gap-2 text-[11px] font-medium uppercase tracking-widest2 text-beige-50/45 ${full ? "sm:col-span-2" : ""}`}>
      {label}
      <div className="relative">
        <Icon
          className={`pointer-events-none absolute left-4 h-4 w-4 text-beige-50/35 ${
            iconAlign === "top" ? "top-3.5" : "top-1/2 -translate-y-1/2"
          }`}
        />
        {children}
      </div>
    </label>
  );
}
