import { prisma } from "@/lib/prisma";
import { SourcePieChart, ServiceDemandChart } from "@/components/admin/analytics-charts";
import { PipelineChart } from "@/components/admin/dashboard-charts";
import { LEAD_STATUSES } from "@/lib/lead-status";

export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  WEBSITE_FORM: "Website Form",
  AI_CHAT: "AI Chat",
  WHATSAPP: "WhatsApp",
};

export default async function AnalyticsPage() {
  const leads = await prisma.lead.findMany();

  const sourceData = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => {
      acc[l.source] = (acc[l.source] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([source, value]) => ({ name: SOURCE_LABELS[source] ?? source, value }));

  const serviceData = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => {
      const key = l.eventType ?? "Unspecified";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const funnelData = LEAD_STATUSES.map((status) => ({
    status: status.replace("_", " "),
    count: leads.filter((l) => l.status === status).length,
  }));

  const total = leads.length;
  const booked = leads.filter((l) => l.status === "CONSULTATION_BOOKED" || l.status === "WON").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Analytics</h1>
        <p className="text-sm text-ink-700/60">
          Lead sources, most-requested services, and conversion funnel — computed from {total} recorded leads.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
          <p className="mb-4 text-sm font-medium text-ink-900">Lead Sources</p>
          {sourceData.length > 0 ? <SourcePieChart data={sourceData} /> : <p className="text-sm text-ink-700/40">No data yet.</p>}
        </div>
        <div className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
          <p className="mb-4 text-sm font-medium text-ink-900">Most-Requested Services</p>
          {serviceData.length > 0 ? <ServiceDemandChart data={serviceData} /> : <p className="text-sm text-ink-700/40">No data yet.</p>}
        </div>
      </div>

      <div className="rounded-lg border border-ink-900/10 bg-beige-100 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-ink-900">Lead Conversion Funnel</p>
          <p className="text-xs text-ink-700/50">{total > 0 ? Math.round((booked / total) * 100) : 0}% overall conversion</p>
        </div>
        <PipelineChart data={funnelData} />
      </div>
    </div>
  );
}
