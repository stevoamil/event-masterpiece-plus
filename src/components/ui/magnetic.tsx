"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

export default function Magnetic({
  children,
  className,
  as,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  [key: string]: unknown;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- `as` is a dynamic tag; JSX can't type-check an arbitrary ElementType's props generically.
  const Tag = (as ?? "button") as any;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };

  const onMouseLeave = () => {
    if (!wrapRef.current) return;
    wrapRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block transition-transform duration-200 ease-out"
    >
      <Tag data-cursor-hover className={cn("inline-flex items-center justify-center", className)} {...rest}>
        {children}
      </Tag>
    </div>
  );
}
