import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Persists a single guided-chat message without invoking the AI backend —
// the concierge widget's quick-reply flow is deterministic client-side
// logic, but transcripts still need to show up in the admin AI Logs view.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const sessionId: string | undefined = body?.sessionId;
  const role: string | undefined = body?.role;
  const content: string | undefined = body?.content;

  if (!sessionId || !role || !content || typeof content !== "string" || content.length > 2000) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (role !== "user" && role !== "assistant") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await prisma.chatLog.create({ data: { sessionId, role, content } });

  return NextResponse.json({ ok: true });
}
