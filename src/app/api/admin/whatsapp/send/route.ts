import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Sends via the Meta WhatsApp Business Platform Graph API when credentials
// are configured. Falls back to recording the message locally so the admin
// inbox UI still works during development without live credentials.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.waId || !body?.message) {
    return NextResponse.json({ error: "waId and message are required" }, { status: 400 });
  }

  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
  let delivered = false;

  if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: body.waId,
          type: "text",
          text: { body: body.message },
        }),
      });
      delivered = res.ok;
    } catch (err) {
      console.error("WhatsApp send error:", err);
    }
  }

  const record = await prisma.whatsAppMessage.create({
    data: { waId: body.waId, fromName: "Event Masterpiece Plus", direction: "out", body: body.message },
  });

  return NextResponse.json({ ...record, delivered });
}
