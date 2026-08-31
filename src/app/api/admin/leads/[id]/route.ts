import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { LEAD_STATUSES } from "@/lib/lead-status";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!status || !LEAD_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const lead = await prisma.lead.update({ where: { id }, data: { status } });
  return NextResponse.json(lead);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  // Chat history and appointments belong to this lead alone, so they go with it.
  // A linked event booking is a real business record — detach it instead of deleting it.
  await prisma.$transaction([
    prisma.chatLog.deleteMany({ where: { leadId: id } }),
    prisma.booking.updateMany({ where: { leadId: id }, data: { leadId: null } }),
    prisma.appointment.deleteMany({ where: { leadId: id } }),
    prisma.lead.delete({ where: { id } }),
  ]);
  return NextResponse.json({ ok: true });
}
