import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const leadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
  eventType: z.string().max(100).optional(),
  eventDate: z.string().optional(),
  guestCount: z.union([z.string(), z.number()]).optional(),
  budgetRange: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
  source: z.enum(["WEBSITE_FORM", "AI_CHAT", "WHATSAPP"]).default("WEBSITE_FORM"),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      eventType: data.eventType || undefined,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      guestCount: data.guestCount ? Number(data.guestCount) : undefined,
      budgetRange: data.budgetRange || undefined,
      message: data.message || undefined,
      source: data.source,
    },
  });

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
