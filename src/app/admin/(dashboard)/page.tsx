import { prisma } from "@/lib/prisma";
import { budgetMidpoint } from "@/lib/budget";
import KpiCard from "@/components/admin/kpi-card";
import { PipelineChart, LeadsTrendChart } from "@/components/admin/dashboard-charts";
import { Users, CalendarCheck, CalendarClock, TrendingUp, Wallet } from "lucide-react";
import { format, startOfDay, subDays } from "date-fns";
import { LEAD_STATUSES, LEAD_STATUS_COLORS } from "@/lib/lead-status";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const weekAgo = subDays(now, 7);

  const [leads, bookings, upcomingConsultations] = await Promise.all([
    prisma.lead.findMany(),
    prisma.booking.findMany(),
    prisma.appointment.findMany({
      where: { date: { gte: now }, status: { in: ["PENDING", "CONFIRMED"] } },
      orderBy: { date: "asc" },
      take: 5,
      include: { lead: true },
    }),
  ]);

  const newLeadsThisWeek = leads.filter((l) => l.createdAt >= weekAgo).length;
  const upcomingEvents = bookings.filter((b) => b.eventDate >= now && b.status !== "CANCELLED").length;
  const bookedLeads = leads.filter((l) => l.status === "CONSULTATION_BOOKED" || l.status === "WON").length;
  const conversionRate = leads.length > 0 ? Math.round((bookedLeads / leads.length) * 100) : 0;
  const pipelineValue = leads
    .filter((l) => l.status !== "WON" && l.status !== "LOST")
    .reduce((sum, l) => sum + budgetMidpoint(l.budgetRange), 0);

  const pipelineData = LEAD_STATUSES.map((status) => ({
    status: status.replace("_", " "),
    count: leads.filter((l) => l.status === status).length,
  }));

  const trendData = Array.from({ length: 14 }).map((_, i) => {
    const day = startOfDay(subDays(now, 13 - i));
    const nextDay = subDays(day, -1);
    return {
      date: format(day, "MMM d"),
      count: leads.filter((l) => l.createdAt >= day && l.createdAt < nextDay).length,
    };
  });

  const recentLeads = [...leads].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-700/60">Overview of leads, bookings, and pipeline health.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="New Leads (7d)" value={String(newLeadsThisWeek)} icon={Users} sub={`${leads.length} total`} />
        <KpiCard
          label="Upcoming Consultations"
          value={String(upcomingConsultations.length)}
          icon={CalendarClock}
          sub="Next scheduled calls"
        />
        <KpiCard label="Upcoming Events" value={String(upcomingEvents)} icon={CalendarCheck} sub={`${bookings.length} total bookings`} />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} sub={`${bookedLeads} booked/won`} />
        <KpiCard
          label="Pipeline Value"
          value={`$${(pipelineValue / 1000).toFixed(0)}k`}
          icon={Wallet}
          sub="Estimated, active leads"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
          <p className="mb-4 text-sm font-medium text-ink-900">Leads Pipeline</p>
          <PipelineChart data={pipelineData} />
        </div>
        <div className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
          <p className="mb-4 text-sm font-medium text-ink-900">New Leads (14 days)</p>
          <LeadsTrendChart data={trendData} />
        </div>
      </div>

      <div className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
        <p className="mb-4 text-sm font-medium text-ink-900">Upcoming Consultations</p>
        <div className="flex flex-col divide-y divide-ink-900/5">
          {upcomingConsultations.map((appt) => (
            <div key={appt.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="font-medium text-ink-900">{appt.lead.name}</p>
                <p className="text-xs text-ink-700/60">{appt.lead.eventType ?? "Event"} consultation</p>
              </div>
              <span className="text-xs text-ink-700/70">{format(appt.date, "EEE, MMM d 'at' h:mm a")}</span>
            </div>
          ))}
          {upcomingConsultations.length === 0 && (
            <p className="py-4 text-center text-sm text-ink-700/50">No upcoming consultations scheduled.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
        <p className="mb-4 text-sm font-medium text-ink-900">Recent Leads</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-xs uppercase tracking-wide text-ink-700/50">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Event</th>
                <th className="pb-2 pr-4">Source</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Received</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-ink-900/5 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-ink-900">{lead.name}</td>
                  <td className="py-2.5 pr-4 text-ink-700/70">{lead.eventType ?? "—"}</td>
                  <td className="py-2.5 pr-4 text-ink-700/70">{lead.source.replace("_", " ")}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${LEAD_STATUS_COLORS[lead.status]}`}>
                      {lead.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-2.5 text-ink-700/70">{format(lead.createdAt, "MMM d, yyyy")}</td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-700/50">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
