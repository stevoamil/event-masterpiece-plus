"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLocale } from "@/lib/i18n/locale-context";

function StepContent({
  index,
  total,
  name,
  desc,
  progress,
}: {
  index: number;
  total: number;
  name: string;
  desc: string;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const mid = (index + 0.5) / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, mid, end], [0, 1, 0]);
  const y = useTransform(progress, [start, mid, end], [24, 0, -24]);
  const scale = useTransform(progress, [start, mid, end], [0.96, 1, 0.96]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="pointer-events-none absolute inset-0 flex flex-col justify-center">
      <span className="font-display text-7xl italic text-brass-500/40 sm:text-8xl">0{index + 1}</span>
      <h3 className="mt-4 font-display text-3xl italic text-beige-50 sm:text-4xl">{name}</h3>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-beige-50/60 sm:text-base">{desc}</p>
    </motion.div>
  );
}

function StepLabel({
  index,
  total,
  name,
  progress,
}: {
  index: number;
  total: number;
  name: string;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, (start + end) / 2, end], [0.35, 1, 0.35]);
  const x = useTransform(progress, [start, (start + end) / 2, end], [0, 12, 0]);

  return (
    <motion.div style={{ opacity, x }} className="flex items-center gap-3 text-beige-50">
      <span className="h-1.5 w-1.5 rounded-full bg-brass-500" />
      <span className="text-sm uppercase tracking-wide">{name}</span>
    </motion.div>
  );
}

export default function ProcessSection() {
  const { dict } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const steps = dict.process.steps;
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" ref={ref} className="relative bg-ink-900" style={{ height: `${steps.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 py-24 sm:px-10">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 lg:grid-cols-[280px_1px_1fr] lg:gap-16">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest2 text-brass-400">{dict.process.kicker}</span>
            <h2 className="mt-4 font-display text-3xl italic leading-tight text-beige-50 sm:text-4xl">{dict.process.title}</h2>
            <div className="mt-10 hidden flex-col gap-4 lg:flex">
              {steps.map((s, i) => (
                <StepLabel key={s.name} index={i} total={steps.length} name={s.name} progress={scrollYProgress} />
              ))}
            </div>
          </div>

          <div className="relative hidden bg-white/10 lg:block">
            <motion.div style={{ height: lineHeight }} className="absolute left-0 top-0 w-full bg-brass-500" />
          </div>

          <div className="relative h-[240px] sm:h-[280px]">
            {steps.map((s, i) => (
              <StepContent key={s.name} index={i} total={steps.length} name={s.name} desc={s.desc} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
