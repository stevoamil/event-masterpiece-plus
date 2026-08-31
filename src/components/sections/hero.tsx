"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ParticleMonogram from "@/components/three/particle-monogram";
import { useLocale } from "@/lib/i18n/locale-context";
import Magnetic from "@/components/ui/magnetic";

export default function Hero() {
  const { dict } = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const assemble = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  // A plain useTransform would fade back in from any small drift back below 0.75
  // (momentum bounce, smooth-scroll overshoot) — that read as the hero text
  // "reappearing" mid-scroll. This latches instead: once faded out it stays hidden
  // through the rest of the fade zone, only releasing once scroll genuinely returns
  // to the very top (so scrolling all the way back up still shows it again).
  const textOpacity = useMotionValue(1);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.35, 0.2, 0.05]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const unsub = assemble.on("change", (v) => {
      progressRef.current = v;
    });
    return () => unsub();
  }, [assemble]);

  useEffect(() => {
    let fadedOut = false;
    const unsub = scrollYProgress.on("change", (v) => {
      if (fadedOut) {
        if (v <= 0.05) {
          fadedOut = false;
          textOpacity.set(1);
        }
        return;
      }
      if (v >= 0.75) {
        fadedOut = true;
        textOpacity.set(0);
        return;
      }
      const t = Math.max(0, Math.min(1, (v - 0.55) / (0.75 - 0.55)));
      textOpacity.set(1 - t);
    });
    return () => unsub();
  }, [scrollYProgress, textOpacity]);

  return (
    <section id="top" ref={sectionRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-beige-50">
        <motion.div style={{ scale: bgScale, opacity: bgOpacity }} className="absolute inset-0 h-full w-full">
          <Image src="/images/about-3.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-beige-50 via-beige-50/70 to-beige-50" />

        <div className="bg-noise absolute inset-0" />

        <div className="absolute inset-0">
          <ParticleMonogram progressRef={progressRef} />
        </div>

        <motion.div
          style={{ opacity: textOpacity }}
          className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-between px-6 py-24 text-center sm:py-28"
        >
          <span className="text-xs font-medium uppercase tracking-widest2 text-brass-500 sm:text-sm">
            {dict.hero.kicker}
          </span>

          <div className="max-w-4xl">
            <h1 className="font-display text-[15vw] italic leading-[0.95] text-ink-900 sm:text-[7vw]">
              {dict.hero.title1}
              <br />
              <span className="text-brass-500">{dict.hero.title2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-sm text-ink-900/70 sm:text-base">
              {dict.hero.subtitle}
            </p>
            <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-4">
              <Magnetic
                as="a"
                href="#contact"
                className="rounded-full bg-ink-900 px-7 py-3.5 text-xs font-medium uppercase tracking-widest2 text-beige-50 transition hover:bg-brass-500"
              >
                {dict.hero.cta1}
              </Magnetic>
              <Magnetic
                as="button"
                type="button"
                onClick={() => window.dispatchEvent(new Event("mm:open-chat"))}
                className="animate-flash rounded-full bg-ink-900 px-7 py-3.5 text-xs font-medium uppercase tracking-widest2 text-beige-50 transition hover:bg-brass-500 hover:text-ink-900"
              >
                {dict.hero.cta2}
              </Magnetic>
            </div>
          </div>

          <motion.div style={{ opacity: cueOpacity }} className="flex flex-col items-center gap-2 text-ink-900/50">
            <span className="text-[10px] uppercase tracking-widest2">{dict.hero.scroll}</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
