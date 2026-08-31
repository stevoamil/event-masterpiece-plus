"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  ox: number;
  oy: number;
  size: number;
  speed: number;
}

export default function ParticleMonogram({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;

    function buildTargets() {
      // Guard against a zero-size container (e.g. layout not yet settled) —
      // getImageData throws IndexSizeError on a 0-width/height canvas.
      if (width <= 0 || height <= 0) return [] as { x: number; y: number }[];

      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d");
      if (!octx) return [] as { x: number; y: number }[];
      octx.clearRect(0, 0, width, height);
      octx.fillStyle = "#fff";
      const isSmall = width < 700;
      const fontSize = Math.min(width, height) * (isSmall ? 0.62 : 0.5);
      octx.font = `italic 500 ${fontSize}px "Cormorant Garamond", serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText("M", width / 2, height / 2);

      // small heart flourish under the M
      const hx = width / 2 + fontSize * 0.34;
      const hy = height / 2 + fontSize * 0.18;
      const hs = fontSize * 0.09;
      octx.beginPath();
      octx.moveTo(hx, hy + hs * 0.3);
      octx.bezierCurveTo(hx - hs, hy - hs * 0.6, hx - hs * 1.8, hy + hs * 0.5, hx, hy + hs * 1.6);
      octx.bezierCurveTo(hx + hs * 1.8, hy + hs * 0.5, hx + hs, hy - hs * 0.6, hx, hy + hs * 0.3);
      octx.fill();

      const data = octx.getImageData(0, 0, width, height).data;
      const points: { x: number; y: number }[] = [];
      const step = isSmall ? 4 : 5;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4 + 3;
          if (data[idx] > 128) {
            points.push({ x, y });
          }
        }
      }
      return points;
    }

    function init() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width <= 0 || height <= 0) return;

      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);

      const targets = buildTargets();
      const count = Math.min(targets.length, 2200);
      const shuffled = targets.sort(() => Math.random() - 0.5).slice(0, count);

      particles = shuffled.map((t) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        ox: Math.random() * width,
        oy: Math.random() * height,
        tx: t.x,
        ty: t.y,
        size: Math.random() * 1.6 + 0.6,
        speed: Math.random() * 0.04 + 0.02,
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      init();
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    function loop() {
      if (width > 0 && height > 0) {
        ctx!.clearRect(0, 0, width, height);
        const assemble = Math.min(1, Math.max(0, progressRef.current));
        const mouse = mouseRef.current;

        for (const p of particles) {
          const baseX = p.ox + (p.tx - p.ox) * assemble;
          const baseY = p.oy + (p.ty - p.oy) * assemble;

          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let pushX = 0;
          let pushY = 0;
          if (dist < 90) {
            const force = (90 - dist) / 90;
            pushX = (dx / (dist || 1)) * force * 26;
            pushY = (dy / (dist || 1)) * force * 26;
          }

          p.x += (baseX + pushX - p.x) * (p.speed + 0.06);
          p.y += (baseY + pushY - p.y) * (p.speed + 0.06);

          const alpha = 0.35 + assemble * 0.65;
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(182, 136, 63, ${alpha})`;
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      raf = requestAnimationFrame(loop);
    }

    init();
    if (particles.length === 0) {
      // Layout wasn't ready on first measure (e.g. fonts/canvas not yet
      // sized) — retry once after paint instead of rendering nothing.
      requestAnimationFrame(() => init());
    }
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
