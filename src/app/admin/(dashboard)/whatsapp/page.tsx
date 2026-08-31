import { prisma } from "@/lib/prisma";
import WhatsAppInbox from "@/components/admin/whatsapp-inbox";

export const dynamic = "force-dynamic";

export default async function WhatsAppPage() {
  const messages = await prisma.whatsAppMessage.findMany({ orderBy: { createdAt: "asc" } });

  const byWaId = new Map<string, typeof messages>();
  for (const m of messages) {
    const arr = byWaId.get(m.waId) ?? [];
    arr.push(m);
    byWaId.set(m.waId, arr);
  }

  const conversations = Array.from(byWaId.entries())
    .map(([waId, msgs]) => ({
      waId,
      fromName: msgs.find((m) => m.direction === "in")?.fromName ?? null,
      lastAt: msgs[msgs.length - 1].createdAt.toISOString(),
      messages: msgs.map((m) => ({
        id: m.id,
        direction: m.direction,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
      })),
    }))
    .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());

  const liveConnected = Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">WhatsApp Inbox</h1>
        <p className="text-sm text-ink-700/60">
          Unified view of WhatsApp conversations{liveConnected ? ", synced via the Business API." : ". Connect the Business API in Settings to enable two-way sync."}
        </p>
      </div>
      <WhatsAppInbox conversations={conversations} liveConnected={liveConnected} />
    </div>
  );
}
