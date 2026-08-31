"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, Images, Pause, Play, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export type GalleryItemDTO = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
};

type Folder = {
  title: string;
  category: string;
  photos: GalleryItemDTO[];
};

const SPEED_PX_PER_SEC = 44;
const RESUME_DELAY_MS = 2000;

function groupIntoFolders(items: GalleryItemDTO[]): Folder[] {
  const map = new Map<string, Folder>();
  for (const item of items) {
    if (!map.has(item.title)) {
      map.set(item.title, { title: item.title, category: item.category, photos: [] });
    }
    map.get(item.title)!.photos.push(item);
  }
  return Array.from(map.values());
}

function SliderCard({ folder, onOpen }: { folder: Folder; onOpen: () => void }) {
  return (
    <button
      type="button"
      data-cursor-hover
      onClick={onOpen}
      className="group relative h-[320px] w-[240px] flex-shrink-0 overflow-hidden rounded-2xl border border-ink-900/10 bg-ink-900/[0.02] text-left shadow-xl shadow-ink-900/10 transition duration-300 hover:border-brass-500/60 sm:h-[380px] sm:w-[290px]"
    >
      <Image
        src={folder.photos[0].imageUrl}
        alt={folder.title}
        fill
        draggable={false}
        sizes="290px"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />

      {/* HUD corner brackets */}
      <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-brass-400/0 transition duration-300 group-hover:border-brass-400/90" />
      <span className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-brass-400/0 transition duration-300 group-hover:border-brass-400/90" />

      {/* diagonal scan sweep on hover */}
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:animate-scan-sweep">
        <span className="block h-full w-1/3 bg-gradient-to-r from-transparent via-brass-400/25 to-transparent" />
      </span>

      {folder.photos.length > 1 && (
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-beige-50/20 bg-ink-900/70 px-2 py-1 text-[10px] text-beige-50 backdrop-blur">
          <Images className="h-3 w-3" />
          {folder.photos.length}
        </span>
      )}

      <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full border border-beige-50/20 bg-ink-900/70 text-beige-50 opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Expand className="h-3.5 w-3.5" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="font-mono text-[9px] uppercase tracking-widest2 text-brass-400">{folder.category}</span>
        <h3 className="mt-1 font-display text-lg italic text-beige-50">{folder.title}</h3>
      </div>
    </button>
  );
}

export default function PortfolioSection({ items }: { items: GalleryItemDTO[] }) {
  const { dict } = useLocale();
  const [active, setActive] = useState("All");
  const [lightboxFolderIndex, setLightboxFolderIndex] = useState<number | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [setWidth, setSetWidth] = useState(0);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((it) => it.category))).sort((a, b) => a.localeCompare(b))],
    [items]
  );

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((g) => g.category === active)),
    [active, items]
  );
  const folders = useMemo(() => groupIntoFolders(filtered), [filtered]);
  const lightboxFolder = lightboxFolderIndex !== null ? folders[lightboxFolderIndex] : null;
  const lightboxPhoto = lightboxFolder ? lightboxFolder.photos[lightboxPhotoIndex] : null;

  // Tripled so the strip can be dragged freely in either direction with a
  // full-set buffer on both sides before it needs to wrap.
  const track = useMemo(() => [...folders, ...folders, ...folders], [folders]);

  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const setWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function measure() {
      const el = trackRef.current;
      if (!el || folders.length === 0) return;
      const full = el.scrollWidth / 3;
      setWidthRef.current = full;
      setSetWidth(full);
      x.set(-full);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, folders.length]);

  useAnimationFrame((_, delta) => {
    const w = setWidthRef.current;
    if (w === 0 || hovering || manuallyPaused || draggingRef.current) return;
    let next = x.get() - (SPEED_PX_PER_SEC * delta) / 1000;
    if (next <= -w * 2) next += w;
    x.set(next);
  });

  function resetResumeTimer() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }

  function nudge(dir: 1 | -1) {
    const w = setWidthRef.current;
    if (w === 0 || folders.length === 0) return;
    resetResumeTimer();
    setManuallyPaused(true);
    const step = w / folders.length;
    let target = x.get() - dir * step;
    if (target <= -w * 2) target += w;
    if (target >= 0) target -= w;
    animate(x, target, { type: "spring", stiffness: 260, damping: 34 });
    resumeTimeoutRef.current = setTimeout(() => setManuallyPaused(false), RESUME_DELAY_MS);
  }

  function onDragStart() {
    draggingRef.current = true;
    resetResumeTimer();
  }
  function onDragEnd() {
    draggingRef.current = false;
    resumeTimeoutRef.current = setTimeout(() => setManuallyPaused(false), RESUME_DELAY_MS);
  }

  const isPlaying = !manuallyPaused && !hovering;

  return (
    <section id="portfolio" className="relative overflow-hidden bg-beige-50 py-28 text-ink-900 sm:py-40">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(27,23,18,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(27,23,18,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-brass-400/15 blur-[140px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest2 text-brass-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass-500" />
              {dict.portfolio.kicker}
            </span>
            <h2 className="mt-4 font-display text-4xl italic leading-tight text-ink-900 sm:text-5xl lg:text-6xl">
              {dict.portfolio.title}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                data-cursor-hover
                onClick={() => {
                  setActive(c);
                  setLightboxFolderIndex(null);
                }}
                className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide transition ${
                  active === c
                    ? "border-brass-500 bg-brass-500 text-beige-50"
                    : "border-ink-900/15 text-ink-900/60 hover:border-brass-500 hover:text-brass-500"
                }`}
              >
                {c === "All" ? dict.portfolio.filterAll : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {folders.length === 0 ? (
        <p className="relative mx-auto mt-14 max-w-[1400px] px-6 text-sm text-ink-900/40 sm:px-10">
          No photos in this category yet.
        </p>
      ) : (
        <div className="relative mt-14" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-beige-50 to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-beige-50 to-transparent sm:w-32" />

          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -setWidth * 2, right: 0 }}
            dragElastic={0.05}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            style={{ x }}
            data-cursor-hover
            className="flex w-max gap-5 px-6 sm:px-10"
          >
            {track.map((folder, idx) => (
              <SliderCard
                key={`${folder.title}-${idx}`}
                folder={folder}
                onOpen={() => {
                  setLightboxFolderIndex(folders.findIndex((f) => f.title === folder.title));
                  setLightboxPhotoIndex(0);
                }}
              />
            ))}
          </motion.div>
        </div>
      )}

      <div className="relative mx-auto mt-10 flex max-w-[1400px] items-center gap-4 px-6 sm:px-10">
        <button
          type="button"
          data-cursor-hover
          onClick={() => nudge(-1)}
          aria-label="Previous"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 transition hover:border-brass-500 hover:text-brass-500"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          data-cursor-hover
          onClick={() => setManuallyPaused((p) => !p)}
          aria-label={manuallyPaused ? "Play" : "Pause"}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 transition hover:border-brass-500 hover:text-brass-500"
        >
          {manuallyPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>

        <div className="flex flex-1 items-center gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-widest2 text-brass-500/80 sm:inline">
            {isPlaying ? "Live scan" : "Paused"}
          </span>
          <div className="relative h-px flex-1 overflow-hidden bg-ink-900/10">
            <div
              className={`absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-brass-500 to-transparent ${
                isPlaying ? "animate-scan-bar" : ""
              }`}
            />
          </div>
        </div>

        <button
          type="button"
          data-cursor-hover
          onClick={() => nudge(1)}
          aria-label="Next"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 transition hover:border-brass-500 hover:text-brass-500"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {lightboxFolder && lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 sm:p-10"
            onClick={() => setLightboxFolderIndex(null)}
          >
            <button
              type="button"
              data-cursor-hover
              className="absolute right-6 top-6 text-white/70 hover:text-white"
              onClick={() => setLightboxFolderIndex(null)}
              aria-label="Close"
            >
              <X className="h-7 w-7" />
            </button>
            {lightboxFolder.photos.length > 1 && (
              <button
                type="button"
                data-cursor-hover
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white sm:left-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxPhotoIndex((i) => (i - 1 + lightboxFolder.photos.length) % lightboxFolder.photos.length);
                }}
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-9 w-9" />
              </button>
            )}
            <motion.div
              key={lightboxPhoto.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="flex max-h-[92vh] max-w-[96vw] flex-col overflow-hidden rounded-2xl sm:max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-[72vh] items-center justify-center bg-ink-900 sm:h-[80vh]">
                <Image
                  src={lightboxPhoto.imageUrl}
                  alt={lightboxFolder.title}
                  width={0}
                  height={0}
                  sizes="96vw"
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
              <div className="bg-ink-900 p-5 text-center">
                <span className="text-[10px] uppercase tracking-widest2 text-brass-400">{lightboxFolder.category}</span>
                <h3 className="mt-1 font-display text-2xl italic text-white">{lightboxFolder.title}</h3>
                {lightboxFolder.photos.length > 1 && (
                  <p className="mt-1 text-xs text-white/50">
                    {lightboxPhotoIndex + 1} / {lightboxFolder.photos.length}
                  </p>
                )}
              </div>
            </motion.div>
            {lightboxFolder.photos.length > 1 && (
              <button
                type="button"
                data-cursor-hover
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white sm:right-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxPhotoIndex((i) => (i + 1) % lightboxFolder.photos.length);
                }}
                aria-label="Next photo"
              >
                <ChevronRight className="h-9 w-9" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
