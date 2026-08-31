import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { startOfDay, endOfDay } from "date-fns";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  if (body.eventDate) {
    const eventDate = new Date(body.eventDate);
    const conflicts = await prisma.booking.findMany({
      where: {
        id: { not: id },
        eventDate: { gte: startOfDay(eventDate), lte: endOfDay(eventDate) },
        status: { notIn: ["CANCELLED"] },
      },
    });
    if (conflicts.length > 0 && !body.force) {
      return NextResponse.json(
        { conflict: true, conflicts: conflicts.map((c) => ({ id: c.id, eventName: c.eventName })) },
        { status: 409 }
      );
    }
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      eventName: body.eventName ?? undefined,
      eventType: body.eventType ?? undefined,
      eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
      location: body.location ?? undefined,
      guestCount: body.guestCount !== undefined ? Number(body.guestCount) : undefined,
      status: body.status ?? undefined,
      notes: body.notes ?? undefined,
    },
  });

  return NextResponse.json(booking);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
