import { prisma } from "@/lib/prisma";

type NotifyLead = {
  name: string;
  email: string | null;
  phone: string | null;
  eventType: string | null;
};

type NotifyAppointment = {
  date: Date;
};

/**
 * Emails the team's first ADMIN user via Resend's REST API when a consultation is
 * booked. Mirrors the graceful no-op pattern already used for WhatsApp sends: check env
 * config, plain `fetch`, never throw — a missing key just means nothing is sent.
 */
export async function notifyAdminByEmail(lead: NotifyLead, appointment: NotifyAppointment) {
  const { RESEND_API_KEY } = process.env;
  if (!RESEND_API_KEY) return;

  const emailNotifications = await prisma.appSetting.findUnique({ where: { key: "email_notifications" } });
  if (emailNotifications?.value !== "true") return;

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } });
  if (!admin?.email) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Events By Marina Concierge <concierge@eventsbymarina.com>",
        to: admin.email,
        subject: `New consultation booked — ${lead.name}`,
        text: `${lead.name} just booked a consultation via the AI concierge.\n\nEvent type: ${lead.eventType ?? "Not specified"}\nDate/time: ${appointment.date.toLocaleString()}\nContact: ${lead.email ?? lead.phone ?? "—"}\n\nView it in the admin dashboard under Consultations.`,
      }),
    });
  } catch (err) {
    console.error("Resend email error:", err);
  }
}

/**
 * Sends the customer their booking confirmation over WhatsApp via the Meta Business
 * Platform Graph API, reusing the exact call already proven in
 * src/app/api/admin/whatsapp/send/route.ts. No-ops without credentials or a phone number.
 */
export async function notifyCustomerByWhatsApp(lead: NotifyLead, appointment: NotifyAppointment) {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !lead.phone) return;

  const message = `Your consultation is confirmed ✨ ${appointment.date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })} at ${appointment.date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}.\n\nThank you for choosing Events By Marina. 🤍 We're delighted to be part of your journey and look forward to bringing your vision to life.`;

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: lead.phone,
        type: "text",
        text: { body: message },
      }),
    });
    if (res.ok) {
      await prisma.whatsAppMessage.create({
        data: { waId: lead.phone, fromName: "Events By Marina", direction: "out", body: message },
      });
    }
  } catch (err) {
    console.error("WhatsApp confirmation send error:", err);
  }
}
