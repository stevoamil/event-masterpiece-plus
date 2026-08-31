export const LEAD_STATUSES = [
  "NEW",
  "QUALIFIED",
  "HIGH_PRIORITY",
  "CONSULTATION_BOOKED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
] as const;

export type LeadStatusValue = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-600",
  QUALIFIED: "bg-amber-500/10 text-amber-600",
  HIGH_PRIORITY: "bg-rose-500/10 text-rose-600",
  CONSULTATION_BOOKED: "bg-brass-500/10 text-brass-500",
  PROPOSAL_SENT: "bg-purple-500/10 text-purple-600",
  WON: "bg-emerald-500/10 text-emerald-600",
  LOST: "bg-ink-900/10 text-ink-700/50",
};
