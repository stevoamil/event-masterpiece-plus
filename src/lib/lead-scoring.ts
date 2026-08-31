import { budgetMidpoint } from "@/lib/budget";
import type { LeadStatusValue } from "@/lib/lead-status";

export type LeadFields = {
  email?: string | null;
  phone?: string | null;
  eventType?: string | null;
  eventDate?: string | Date | null;
  guestCount?: number | null;
  budgetRange?: string | null;
};

const HIGH_PRIORITY_BUDGET_THRESHOLD = 40000; // matches the top two $-band options in the contact/chat budget dictionary
const HIGH_PRIORITY_GUEST_THRESHOLD = 150;

/** Pure scoring function — given the lead's current known fields, what status does it deserve? */
export function scoreLead(fields: LeadFields): LeadStatusValue {
  const hasContact = !!(fields.email || fields.phone);
  if (!hasContact) return "NEW";

  const hasCoreDetails = !!(fields.eventType && (fields.eventDate || fields.guestCount || fields.budgetRange));
  if (!hasCoreDetails) return "NEW";

  const isHighBudget = budgetMidpoint(fields.budgetRange) >= HIGH_PRIORITY_BUDGET_THRESHOLD;
  const isHighGuestCount = (fields.guestCount ?? 0) >= HIGH_PRIORITY_GUEST_THRESHOLD;
  if (isHighBudget || isHighGuestCount) return "HIGH_PRIORITY";

  return "QUALIFIED";
}

/**
 * Only ever upgrades NEW/QUALIFIED leads — never overwrites a status the booking flow
 * or an admin has already progressed further (CONSULTATION_BOOKED, PROPOSAL_SENT, WON, LOST).
 */
export function nextLeadStatus(currentStatus: string, fields: LeadFields): LeadStatusValue {
  if (currentStatus !== "NEW" && currentStatus !== "QUALIFIED") {
    return currentStatus as LeadStatusValue;
  }
  return scoreLead(fields);
}
