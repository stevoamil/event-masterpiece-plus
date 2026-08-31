import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const client = await prisma.client.update({
    where: { id },
    data: {
      name: body.name ?? undefined,
      email: body.email ?? undefined,
      phone: body.phone ?? undefined,
      notes: body.notes ?? undefined,
    },
  });

  return NextResponse.json(client);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  // A booking's own record is worth keeping even if the client card is removed — just
  // detach it rather than cascading the delete.
  await prisma.$transaction([
    prisma.booking.updateMany({ where: { clientId: id }, data: { clientId: null } }),
    prisma.client.delete({ where: { id } }),
  ]);
  return NextResponse.json({ ok: true });
}
