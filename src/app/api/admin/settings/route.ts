import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.key || typeof body.value !== "string") {
    return NextResponse.json({ error: "key and value are required" }, { status: 400 });
  }

  const setting = await prisma.appSetting.upsert({
    where: { key: body.key },
    update: { value: body.value },
    create: { key: body.key, value: body.value },
  });

  return NextResponse.json(setting);
}
