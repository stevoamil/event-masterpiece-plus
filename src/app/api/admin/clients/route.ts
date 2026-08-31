import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const client = await prisma.client.create({
    data: {
      name: body.name,
      email: body.email || undefined,
      phone: body.phone || undefined,
      notes: body.notes || undefined,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
