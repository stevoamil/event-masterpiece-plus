"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export default function TestimonialsSection() {
  const { dict } = useLocale();
  const items = dict.testimonials.items;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 5500);
    return () => clearInterval(id);
  }, [items.length]);

  function go(dir: number) {
    setIndex((i) => (i + dir + items.length) % items.length);
  }

  return (
    <section id="testimonials" className="relative overflow-hidden bg-beige-100 py-28 sm:py-40">
      <div className="mx-auto max-w-[1000px] px-6 text-center sm:px-10">
        <span className="text-xs font-medium uppercase tracking-widest2 text-brass-500">{dict.testimonials.kicker}</span>
        <h2 className="mt-4 font-display text-4xl italic text-ink-900 sm:text-5xl">{dict.testimonials.title}</h2>

        <div className="relative mt-16 flex h-[340px] items-center justify-center [perspective:1400px] sm:h-[300px]">
          {items.map((item, i) => {
            const offset = i - index;
            const norm = ((offset % items.length) + items.length) % items.length;
            const rel = norm > items.length / 2 ? norm - items.length : norm;
            const isActive = rel === 0;
            return (
              <motion.div
                key={item.name}
                animate={{
                  x: rel * 90,
                  scale: isActive ? 1 : 0.82,
                  rotateY: rel * -18,
                  opacity: Math.abs(rel) > 1 ? 0 : isActive ? 1 : 0.4,
                  zIndex: isActive ? 10 : 5 - Math.abs(rel),
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-[90%] max-w-lg rounded-3xl border border-ink-900/10 bg-beige-50 p-8 shadow-xl shadow-black/5 sm:p-10"
              >
                <Quote className="mx-auto h-7 w-7 text-brass-500" />
                <p className="mt-5 font-display text-xl italic leading-snug text-ink-900 sm:text-2xl">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6">
                  <div className="text-sm font-medium text-ink-900">{item.name}</div>
                  <div className="text-xs uppercase tracking-wide text-ink-900/50">{item.role}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            data-cursor-hover
            onClick={() => go(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/20 text-ink-900 hover:border-brass-500 hover:text-brass-500"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                data-cursor-hover
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brass-500" : "w-1.5 bg-ink-900/20"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            data-cursor-hover
            onClick={() => go(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/20 text-ink-900 hover:border-brass-500 hover:text-brass-500"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
