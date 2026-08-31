import { prisma } from "@/lib/prisma";
import { addDays, addMinutes, format, isAfter, startOfDay } from "date-fns";

export type ConsultationHours = {
  days: number[]; // 0=Sun..6=Sat
  startHour: number;
  endHour: number;
  slotMinutes: number;
};

const DEFAULT_HOURS: ConsultationHours = {
  days: [2, 3, 4, 5, 6], // Tue–Sat
  startHour: 10,
  endHour: 17.5,
  slotMinutes: 30,
};

async function getConfig(): Promise<ConsultationHours> {
  const setting = await prisma.appSetting.findUnique({ where: { key: "consultation_hours" } });
  if (!setting?.value) return DEFAULT_HOURS;
  try {
    return { ...DEFAULT_HOURS, ...JSON.parse(setting.value) };
  } catch {
    return DEFAULT_HOURS;
  }
}

function timesForDay(config: ConsultationHours): string[] {
  const times: string[] = [];
  const endMinutes = config.endHour * 60;
  for (let minutes = config.startHour * 60; minutes < endMinutes; minutes += config.slotMinutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return times;
}

export function slotToDate(dateStr: string, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const [y, mo, d] = dateStr.split("-").map(Number);
  return new Date(y, mo - 1, d, h, m, 0, 0);
}

export type DaySlots = { date: string; times: string[] };

/** Real, live availability: business-hour slots for the next N days minus already-booked appointments. */
export async function getAvailableSlots(daysAhead = 10): Promise<DaySlots[]> {
  const config = await getConfig();
  const now = new Date();
  const today = startOfDay(now);

  const existing = await prisma.appointment.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      date: { gte: today, lt: addDays(today, daysAhead + 1) },
    },
    select: { date: true },
  });
  const taken = new Set(existing.map((a) => `${format(a.date, "yyyy-MM-dd")}_${format(a.date, "HH:mm")}`));

  const dayTimes = timesForDay(config);
  const results: DaySlots[] = [];

  for (let i = 0; i <= daysAhead; i++) {
    const day = addDays(today, i);
    if (!config.days.includes(day.getDay())) continue;
    const dateStr = format(day, "yyyy-MM-dd");

    const times = dayTimes.filter((t) => {
      if (taken.has(`${dateStr}_${t}`)) return false;
      if (i === 0 && !isAfter(slotToDate(dateStr, t), addMinutes(now, 30))) return false;
      return true;
    });

    if (times.length > 0) results.push({ date: dateStr, times });
  }

  return results;
}

/** Exact re-check at booking time to close the race window between "check" and "book". */
export async function isSlotTaken(dateStr: string, time: string): Promise<boolean> {
  const existing = await prisma.appointment.findFirst({
    where: { status: { in: ["PENDING", "CONFIRMED"] }, date: slotToDate(dateStr, time) },
  });
  return !!existing;
}
