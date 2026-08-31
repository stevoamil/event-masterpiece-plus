import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Meta WhatsApp Business Platform webhook.
// Setup: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
// Requires WHATSAPP_VERIFY_TOKEN and WHATSAPP_ACCESS_TOKEN env vars to go live.
// Without those, the "Chat on WhatsApp" wa.me buttons on the site still work
// as the functional fallback described in the spec.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

type WhatsAppWebhookPayload = {
  entry?: {
    changes?: {
      value?: {
        contacts?: { profile?: { name?: string }; wa_id?: string }[];
        messages?: { from?: string; text?: { body?: string } }[];
      };
    }[];
  }[];
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as WhatsAppWebhookPayload | null;
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const changes = body.entry?.flatMap((e) => e.changes ?? []) ?? [];

  for (const change of changes) {
    const value = change.value;
    const contact = value?.contacts?.[0];
    for (const msg of value?.messages ?? []) {
      if (!msg.from) continue;
      await prisma.whatsAppMessage.create({
        data: {
          waId: msg.from,
          fromName: contact?.profile?.name,
          direction: "in",
          body: msg.text?.body ?? "",
        },
      });

      const existingLead = await prisma.lead.findFirst({ where: { phone: msg.from } });
      if (!existingLead) {
        await prisma.lead.create({
          data: {
            name: contact?.profile?.name ?? "WhatsApp Contact",
            phone: msg.from,
            source: "WHATSAPP",
            message: msg.text?.body,
          },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
