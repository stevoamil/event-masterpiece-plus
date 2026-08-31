import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const item = await prisma.galleryItem.update({
    where: { id },
    data: {
      title: body.title ?? undefined,
      category: body.category ?? undefined,
      order: body.order !== undefined ? Number(body.order) : undefined,
      published: body.published !== undefined ? Boolean(body.published) : undefined,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
