import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const role = body?.role;
  if (role !== "ADMIN" && role !== "STAFF") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (id === session.userId && role !== "ADMIN") {
    return NextResponse.json({ error: "You cannot remove your own admin access." }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id }, data: { role } });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (id === session.userId) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json({ error: "Cannot remove the last remaining admin." }, { status: 400 });
    }
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
