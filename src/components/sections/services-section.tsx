"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { useLocale } from "@/lib/i18n/locale-context";
import { serviceCategories, type ServiceCategory } from "@/lib/services-data";
import { serviceIcons } from "@/lib/service-icons";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const AUTOPLAY_MS = 3800;
const RESUME_DELAY_MS = 5500;
const DRAG_THRESHOLD = 70;

// Shortest signed distance from `i` to `active` around the circular deck —
// so cards wrap the "short way" instead of sweeping across the full row.
function relativeIndex(i: number, active: number, total: number) {
  let diff = i - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function DeckCard({
  service,
  rel,
  ctaLabel,
}: {
  service: ServiceCategory;
  rel: number;
  ctaLabel: string;
}) {
  const { locale } = useLocale();
  const content = service[locale];
  const Icon = serviceIcons[service.slug] ?? Heart;
  const isActive = rel === 0;

  return (
    <motion.div
      animate={{
        x: rel * 230,
        rotateY: Math.max(-50, Math.min(50, rel * -32)),
        scale: Math.max(0.68, 1 - Math.abs(rel) * 0.16),
        opacity: Math.abs(rel) > 3 ? 0 : Math.max(0.15, 1 - Math.abs(rel) * 0.32),
        zIndex: 100 - Math.abs(rel) * 10,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      className="pointer-events-none absolute left-1/2 top-1/2 w-[240px] -translate-x-1/2 -translate-y-1/2 sm:w-[290px]"
    >
      <Link
        href={`/services/${service.slug}`}
        data-cursor-hover
        className={`block ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
        tabIndex={isActive ? 0 : -1}
      >
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={service.image}
              alt={content.name}
              fill
              draggable={false}
              sizes="290px"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/35 to-transparent" />
            <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink-900/60 backdrop-blur">
              <Icon className="h-4 w-4 text-brass-400" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="font-display text-xl italic text-beige-50">{content.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-beige-50/70">{content.shortDesc}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest2 text-brass-400 transition group-hover:gap-3">
                {ctaLabel} →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServicesSection() {
  const { dict } = useLocale();
  const total = serviceCategories.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function play() {
    stop();
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
  }
  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  // Automatic playback by default; any manual navigation pauses it and
  // schedules it to resume after a quiet period.
  useEffect(() => {
    play();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  function goTo(i: number) {
    setActiveIndex(((i % total) + total) % total);
    stop();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(play, RESUME_DELAY_MS);
  }

  function onDragEnd(_e: unknown, info: PanInfo) {
    if (info.offset.x < -DRAG_THRESHOLD) goTo(activeIndex + 1);
    else if (info.offset.x > DRAG_THRESHOLD) goTo(activeIndex - 1);
  }

  return (
    <section id="services" className="relative overflow-hidden bg-ink-900 py-28 text-beige-50 sm:py-40">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="mb-14 max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-widest2 text-brass-400">{dict.services.kicker}</span>
          <h2 className="mt-4 font-display text-4xl italic leading-tight sm:text-5xl lg:text-6xl">{dict.services.title}</h2>
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragStart={stop}
        onDragEnd={onDragEnd}
        data-cursor-hover
        className="relative h-[420px] touch-pan-y sm:h-[480px]"
        style={{ perspective: "1800px" }}
      >
        {serviceCategories.map((service, i) => {
          const rel = relativeIndex(i, activeIndex, total);
          if (Math.abs(rel) > 4) return null;
          return <DeckCard key={service.slug} service={service} rel={rel} ctaLabel={dict.services.cta} />;
        })}
      </motion.div>

      <div className="mx-auto mt-10 flex max-w-[1400px] items-center gap-4 px-6 sm:px-10">
        <button
          data-cursor-hover
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous service"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-beige-50/20 text-beige-50 transition hover:border-brass-400 hover:text-brass-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="flex-shrink-0 font-mono text-xs tabular-nums text-beige-50/50">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 bg-beige-50/15">
          <motion.div
            className="h-full origin-left bg-brass-400"
            animate={{ scaleX: (activeIndex + 1) / total }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>

        <button
          data-cursor-hover
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next service"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-beige-50/20 text-beige-50 transition hover:border-brass-400 hover:text-brass-400"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
