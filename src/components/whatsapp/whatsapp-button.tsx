"use client";

import { MessageCircle } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

// `||` (not `??`) so an empty-string env var — e.g. left blank in Vercel's dashboard
// rather than fully unset — still falls back to the real number instead of producing
// a numberless https://wa.me/ link.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "13025009067";

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppButton({
  variant = "inline",
  label,
  className,
}: {
  variant?: "floating" | "inline" | "nav";
  label?: string;
  className?: string;
}) {
  const { dict } = useLocale();
  const href = getWhatsAppUrl(dict.whatsappMessage);
  const text = label ?? dict.nav.whatsapp;

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        data-cursor-hover
        className="group fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 sm:bottom-8 sm:right-8"
        aria-label={text}
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25D366]" />
        <MessageCircle className="relative h-6 w-6" strokeWidth={2} />
      </a>
    );
  }

  if (variant === "nav") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        data-cursor-hover
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-4 py-2 text-xs font-medium tracking-wide text-ink-900 transition hover:border-brass-500 hover:text-brass-500",
          className
        )}
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {text}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor-hover
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#25D366]/30 transition hover:brightness-110",
        className
      )}
    >
      <MessageCircle className="h-4 w-4" />
      {text}
    </a>
  );
}
