import { prisma } from "@/lib/prisma";
import AiLogsPanel from "@/components/admin/ai-logs-panel";

export const dynamic = "force-dynamic";

export default async function AiLogsPage() {
  const logs = await prisma.chatLog.findMany({
    orderBy: { createdAt: "asc" },
    include: { lead: { select: { name: true } } },
  });

  const bySession = new Map<string, typeof logs>();
  for (const log of logs) {
    const arr = bySession.get(log.sessionId) ?? [];
    arr.push(log);
    bySession.set(log.sessionId, arr);
  }

  const sessions = Array.from(bySession.entries())
    .map(([sessionId, messages]) => ({
      sessionId,
      leadName: messages.find((m) => m.lead)?.lead?.name ?? null,
      flagged: messages.some((m) => m.flagged),
      lastMessageAt: messages[messages.length - 1].createdAt.toISOString(),
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
    }))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">AI Assistant Logs</h1>
        <p className="text-sm text-ink-700/60">Review concierge conversations and flag ones needing human follow-up.</p>
      </div>
      <AiLogsPanel sessions={sessions} />
    </div>
  );
}
