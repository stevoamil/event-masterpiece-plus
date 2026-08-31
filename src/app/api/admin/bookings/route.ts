import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { startOfDay, endOfDay } from "date-fns";

async function findConflicts(eventDate: Date, excludeId?: string) {
  return prisma.booking.findMany({
    where: {
      id: excludeId ? { not: excludeId } : undefined,
      eventDate: { gte: startOfDay(eventDate), lte: endOfDay(eventDate) },
      status: { notIn: ["CANCELLED"] },
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.eventName || !body?.eventType || !body?.eventDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const eventDate = new Date(body.eventDate);
  const conflicts = await findConflicts(eventDate);
  if (conflicts.length > 0 && !body.force) {
    return NextResponse.json(
      { conflict: true, conflicts: conflicts.map((c) => ({ id: c.id, eventName: c.eventName })) },
      { status: 409 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      eventName: body.eventName,
      eventType: body.eventType,
      eventDate,
      location: body.location || undefined,
      guestCount: body.guestCount ? Number(body.guestCount) : undefined,
      status: body.status ?? "TENTATIVE",
      notes: body.notes || undefined,
      clientId: body.clientId || undefined,
      leadId: body.leadId || undefined,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
