"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale } from "@/lib/i18n/locale-context";

export default function AboutSection() {
  const { dict } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgRotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);

  const stats = [
    { value: dict.about.stat1, label: dict.about.stat1Label },
    { value: dict.about.stat2, label: dict.about.stat2Label },
    { value: dict.about.stat3, label: dict.about.stat3Label },
  ];

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-beige-50 py-28 sm:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-24">
        <div className="order-2 lg:order-1">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs font-medium uppercase tracking-widest2 text-brass-500"
          >
            {dict.about.kicker}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 font-display text-4xl italic leading-[1.05] text-ink-900 sm:text-5xl lg:text-6xl"
          >
            {dict.about.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-900/70"
          >
            {dict.about.body}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 font-display text-2xl italic text-brass-500"
          >
            {dict.about.quote}
          </motion.p>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ink-900/10 pt-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="font-display text-3xl text-ink-900 sm:text-4xl">{s.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-ink-900/50">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <motion.div
            style={{ y: imgY, rotate: imgRotate, scale: imgScale }}
            className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl shadow-black/20"
          >
            <Image src="/images/about-marina-portrait.webp" alt="Marina styling a reception table" fill sizes="(max-width: 1024px) 90vw, 40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative z-10 mx-auto -mt-16 w-4/5 max-w-xs overflow-hidden rounded-2xl border-4 border-beige-50 shadow-xl sm:-mt-20"
          >
            <Image src="/images/about-ballroom-reception.webp" alt="Elegant ballroom reception styling" width={800} height={640} className="aspect-[5/4] w-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
