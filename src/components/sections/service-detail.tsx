"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { serviceCategories, type ServiceCategory } from "@/lib/services-data";
import { serviceIcons } from "@/lib/service-icons";
import WhatsAppButton from "@/components/whatsapp/whatsapp-button";
import Magnetic from "@/components/ui/magnetic";

function MiniFloatCard({ service, delay }: { service: ServiceCategory; delay: number }) {
  const { locale } = useLocale();
  const content = service[locale];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/services/${service.slug}`}
        data-cursor-hover
        className="group block overflow-hidden rounded-2xl border border-ink-900/10 bg-beige-50 shadow-lg shadow-black/5 transition-shadow hover:shadow-xl hover:shadow-black/10"
      >
        <div className="relative flex h-28 items-center justify-center overflow-hidden bg-beige-100">
          <Image
            src={service.image}
            alt={content.name}
            fill
            sizes="240px"
            className="object-contain p-3 transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex items-center justify-between gap-2 p-4">
          <span className="font-display text-sm italic text-ink-900">{content.name}</span>
          <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-brass-500 transition group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServiceDetail({ service }: { service: ServiceCategory }) {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const content = service[locale];
  const Icon = serviceIcons[service.slug];

  const currentIndex = serviceCategories.findIndex((s) => s.slug === service.slug);
  const suggestions = Array.from({ length: 3 }).map(
    (_, i) => serviceCategories[(currentIndex + 1 + i) % serviceCategories.length]
  );

  const close = useCallback(() => {
    // Prefer going back (restores the homepage's scroll position) — fall
    // back to a fresh navigation if this page was opened directly.
    if (window.history.length > 1) router.back();
    else router.push("/#services");
  }, [router]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [close]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] overflow-y-auto bg-ink-900/70 backdrop-blur-md"
      onClick={close}
    >
      <div className="mx-auto min-h-full max-w-[1100px] px-4 py-10 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative overflow-hidden rounded-[2.5rem] border border-ink-900/10 bg-beige-50 shadow-2xl shadow-black/40"
        >
          <button
            onClick={close}
            data-cursor-hover
            aria-label="Close"
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/10 bg-beige-50/90 text-ink-900 shadow-lg backdrop-blur transition hover:bg-ink-900 hover:text-beige-50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid lg:grid-cols-2">
            <div className="relative flex aspect-[4/5] items-center justify-center bg-beige-100 lg:aspect-auto">
              <Image
                src={service.image}
                alt={content.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6 sm:p-10"
              />
              {Icon && (
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-full border border-ink-900/10 bg-ink-900 shadow-xl sm:h-16 sm:w-16"
                >
                  <Icon className="h-6 w-6 text-brass-400" />
                </motion.div>
              )}
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-12">
              <span className="text-xs font-medium uppercase tracking-widest2 text-brass-500">{dict.services.kicker}</span>
              <h1 className="mt-3 font-display text-4xl italic leading-[1.05] text-ink-900 sm:text-5xl">{content.name}</h1>
              <p className="mt-6 text-base leading-relaxed text-ink-900/75">{content.longDesc}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Magnetic
                  as="a"
                  href="/#contact"
                  className="rounded-full bg-ink-900 px-7 py-3.5 text-xs font-medium uppercase tracking-widest2 text-beige-50 transition hover:bg-brass-500"
                >
                  {dict.contact.form.submit}
                </Magnetic>
                <WhatsAppButton variant="inline" label={dict.contact.whatsapp} />
              </div>
            </div>
          </div>

          <div className="border-t border-ink-900/10 bg-beige-100/50 p-8 sm:p-12">
            <span className="text-xs font-medium uppercase tracking-widest2 text-ink-900/40">{dict.services.kicker}</span>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {suggestions.map((s, i) => (
                <MiniFloatCard key={s.slug} service={s} delay={i * 0.06} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
