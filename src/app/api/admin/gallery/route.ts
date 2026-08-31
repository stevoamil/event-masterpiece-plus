import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.category || !body?.imageUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const maxOrder = await prisma.galleryItem.aggregate({ _max: { order: true } });
  const item = await prisma.galleryItem.create({
    data: {
      title: body.title,
      category: body.category,
      imageUrl: body.imageUrl,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
