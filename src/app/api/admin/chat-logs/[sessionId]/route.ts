import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId } = await params;
  await prisma.chatLog.deleteMany({ where: { sessionId } });
  return NextResponse.json({ ok: true });
}
