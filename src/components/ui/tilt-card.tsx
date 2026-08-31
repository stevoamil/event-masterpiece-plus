"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

export default function TiltCard({
  children,
  className,
  onClick,
  strength = 10,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateZ(10px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  }

  return (
    <div
      ref={ref}
      data-cursor-hover
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && onClick() : undefined}
      className={className}
      style={{ transition: "transform 0.3s ease-out", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
