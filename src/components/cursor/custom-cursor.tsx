"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (isAdmin) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.style.cursor = "none";

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;

    function onMove(e: MouseEvent) {
      setHidden(false);
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot!.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor-hover]"
      );
      setIsPointer(!!interactive);
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ring) ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(animate);
    }

    let raf = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove);
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass-500"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-color,background-color] duration-200 ease-out ${
          isPointer ? "h-12 w-12 border-brass-500 bg-brass-500/10" : "h-8 w-8 border-ink-900/40 bg-transparent"
        }`}
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
