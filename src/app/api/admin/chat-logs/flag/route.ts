import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.sessionId || typeof body.flagged !== "boolean") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  await prisma.chatLog.updateMany({
    where: { sessionId: body.sessionId },
    data: { flagged: body.flagged },
  });

  return NextResponse.json({ ok: true });
}
