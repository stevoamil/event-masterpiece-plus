import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-ink-900/10 bg-beige-100 p-5", className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-ink-700/50">{label}</p>
        <Icon className="h-4 w-4 text-brass-500" />
      </div>
      <p className="font-display text-3xl italic text-ink-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-700/50">{sub}</p>}
    </div>
  );
}
