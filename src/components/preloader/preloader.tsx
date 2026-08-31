"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(!isAdmin);

  useEffect(() => {
    if (isAdmin) return;

    const start = Date.now();
    const duration = 1800;
    let raf: number;
    function tick() {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 350);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink-900"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/images/logo-events-by-marina.avif"
                alt="Events By Marina"
                width={197}
                height={203}
                priority
                className="h-36 w-auto sm:h-44"
                style={{
                  opacity: progress / 100,
                  filter: "drop-shadow(0 0 6px rgba(217,185,120,0.55))",
                }}
              />
            </div>
            <div className="h-px w-56 overflow-hidden bg-white/10 sm:w-72">
              <motion.div className="h-full bg-brass-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-sans text-xs tracking-widest2 text-white/50">{progress}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
