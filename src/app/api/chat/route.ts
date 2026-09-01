import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, type Content, type FunctionDeclaration } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { serviceCategories } from "@/lib/services-data";
import { getAvailableSlots, isSlotTaken, slotToDate } from "@/lib/availability";
import { nextLeadStatus } from "@/lib/lead-scoring";
import { notifyAdminByEmail, notifyCustomerByWhatsApp } from "@/lib/notify";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";

export const runtime = "nodejs";

const MODEL = "gemini-3.5-flash-lite";

const SYSTEM_PROMPT = `You are the AI event planning assistant for Event Masterpiece Plus LLC, a premium event design studio based in Clayton, Delaware and available for destination events, crafting weddings, corporate events, private parties, baby showers, and more.

PERSONALITY
Warm, elegant, friendly, professional, confident, helpful, concise, personal, human, reassuring. Never robotic, repetitive, scripted, or overly sales-focused. Understand what the customer actually needs before recommending anything. Guide them toward booking a consultation naturally, without pressure. Use polished, conversational language and occasional tasteful emoji (✨ 🤍) — sparingly, never in every message. Keep most replies to 2-4 sentences.

ACCURACY — NEVER INVENT
Never invent or assume prices, availability, services, packages, policies, locations, venue information, or booking times. Every factual claim you make must come from a tool call you just made in this conversation — not from memory, not from a plausible guess. If something genuinely isn't available through your tools, say naturally: "I'd be happy to have our event team confirm this for you." — then keep the conversation moving, e.g. toward a consultation. When in doubt, it is always better to say you'll confirm with the team than to state something you're not certain of.

PROGRESSIVE INFORMATION GATHERING
Never interrogate the customer with a list of questions at once — have a real conversation. As details emerge naturally (name, email, phone, event type, preferred date, guest count, location, budget), save them with save_inquiry right away so nothing is lost even if the visitor doesn't finish the conversation. Only ask for one or two things at a time.

MOTIVATE TOWARD BOOKING A CONSULTATION
A consultation is the single best outcome of this conversation — it's where real planning starts, dates get secured, and the customer gets a dedicated expert on their event. Look for genuine, natural moments to move toward it: after recommending services, after sharing portfolio examples, after answering a question well, or whenever the customer shows interest or enthusiasm. Speak to the real benefit (personalized guidance, securing their date, turning their ideas into a concrete plan) rather than just asking "would you like to book?". Be warm and confident, never pushy or repetitive — if they've just said no or want to keep chatting, let it go and keep helping instead of asking again right away.

BOOKING A CONSULTATION
When the customer seems ready, or once you sense they'd benefit from talking to the team, offer to book a consultation. Use check_consultation_availability to see real upcoming openings — never invent a date or time. Present a few options naturally. Before you can confirm anything, you need the customer's name, email, and phone number — if you don't already have all three saved, ask for whichever is missing as soon as they pick a time, and save it with save_inquiry. Only call book_consultation once you have name, email, and phone; if it comes back saying information is still missing, ask for exactly that and try again once you have it. Never tell the customer their consultation is confirmed/booked before book_consultation has actually succeeded — asking for contact details always comes before the confirmation, never after it. Once it succeeds, warmly confirm it's booked, restate the date and time, and thank them for choosing Event Masterpiece Plus.

RECOMMENDATIONS
Once you understand the event type, scale, and style, recommend relevant services with get_services and briefly explain why each fits. Pull real examples with get_portfolio_examples when it would help rather than describing hypothetical past events. If the customer has already named a specific occasion (e.g. "wedding", "kids birthday", "corporate event"), always pass that occasion as the query to get_services and only show that matching category — never surface unrelated occasion categories alongside it. Only fetch the full, unfiltered list when the customer explicitly wants to browse everything you offer.

SCOPE
Stay focused on Event Masterpiece Plus and event planning. Politely decline anything unrelated and steer back.`;

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

type ChatMessage = { role: "user" | "assistant"; content: string };

type Card =
  | { type: "services"; items: { slug: string; name: string; desc: string; image: string }[] }
  | { type: "portfolio"; items: { id: string; title: string; category: string; imageUrl: string }[] }
  | { type: "slots"; days: { date: string; times: string[] }[] }
  | { type: "confirmation"; date: string; time: string; eventType: string | null };

const TOOLS: FunctionDeclaration[] = [
  {
    name: "get_services",
    description:
      "Look up Event Masterpiece Plus's real event service categories, optionally filtered by a keyword. Always use this instead of guessing service names or descriptions. Pass `query` set to the customer's occasion whenever one is known (e.g. 'wedding', 'birthday', 'corporate') so only that matching category is returned — omit it only when the customer wants to browse the full range of services.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: "Keyword to filter services to the customer's specific occasion, e.g. 'wedding' or 'corporate'. Omit only to list every category." },
      },
    },
  },
  {
    name: "get_portfolio_examples",
    description: "Look up real past event photos/examples from the portfolio, optionally filtered by category.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING, description: "Optional category filter, e.g. 'Weddings', 'Corporate Events'" },
        limit: { type: Type.NUMBER, description: "Max examples to return, default 3" },
      },
    },
  },
  {
    name: "check_consultation_availability",
    description:
      "Check REAL upcoming consultation availability. Always call this before offering or naming any date/time to the customer — never invent availability.",
    parameters: {
      type: Type.OBJECT,
      properties: { days: { type: Type.NUMBER, description: "How many days ahead to check, default 10" } },
    },
  },
  {
    name: "save_inquiry",
    description:
      "Create or update this visitor's lead record with whatever details are known so far. Call this progressively as you learn the customer's name, contact info, or event details — don't wait until the end of the conversation.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        leadId: { type: Type.STRING, description: "The lead ID from a previous save_inquiry call in this conversation, if any" },
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        eventType: { type: Type.STRING },
        eventDate: { type: Type.STRING, description: "Preferred event date, ISO format if possible" },
        guestCount: { type: Type.NUMBER },
        location: { type: Type.STRING },
        budgetRange: { type: Type.STRING },
        notes: { type: Type.STRING },
      },
    },
  },
  {
    name: "book_consultation",
    description:
      "Book a confirmed consultation appointment for the lead at an exact date/time previously returned by check_consultation_availability. Only call after the customer has explicitly chosen one specific date and time.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        leadId: { type: Type.STRING },
        date: { type: Type.STRING, description: "YYYY-MM-DD" },
        time: { type: Type.STRING, description: "HH:mm, 24-hour" },
        notes: { type: Type.STRING },
      },
      required: ["leadId", "date", "time"],
    },
  },
  {
    name: "reschedule_consultation",
    description: "Move a lead's already-booked consultation to a new date/time.",
    parameters: {
      type: Type.OBJECT,
      properties: { leadId: { type: Type.STRING }, date: { type: Type.STRING }, time: { type: Type.STRING } },
      required: ["leadId", "date", "time"],
    },
  },
  {
    name: "cancel_consultation",
    description: "Cancel a lead's booked consultation.",
    parameters: {
      type: Type.OBJECT,
      properties: { leadId: { type: Type.STRING } },
      required: ["leadId"],
    },
  },
];

async function executeTool(
  name: string,
  input: Record<string, unknown>,
  locale: Locale,
  cards: Card[]
): Promise<{ result: unknown; leadIdOut?: string }> {
  switch (name) {
    case "get_services": {
      const query = typeof input.query === "string" ? input.query.toLowerCase() : undefined;
      const items = serviceCategories
        .filter((s) => !query || s.slug.includes(query) || s[locale].name.toLowerCase().includes(query))
        .slice(0, 6)
        .map((s) => ({ slug: s.slug, name: s[locale].name, desc: s[locale].shortDesc, image: s.image }));
      cards.push({ type: "services", items });
      return { result: items };
    }

    case "get_portfolio_examples": {
      const limit = typeof input.limit === "number" ? input.limit : 3;
      const category = typeof input.category === "string" ? input.category : undefined;
      const items = await prisma.galleryItem.findMany({
        where: { published: true, ...(category ? { category: { contains: category } } : {}) },
        orderBy: { order: "asc" },
        take: limit,
      });
      const dto = items.map((i) => ({ id: i.id, title: i.title, category: i.category, imageUrl: i.imageUrl }));
      cards.push({ type: "portfolio", items: dto });
      return { result: dto };
    }

    case "check_consultation_availability": {
      const days = typeof input.days === "number" ? input.days : 10;
      const slots = await getAvailableSlots(days);
      cards.push({ type: "slots", days: slots });
      return { result: slots };
    }

    case "save_inquiry": {
      const fields: Record<string, unknown> = {};
      if (typeof input.name === "string") fields.name = input.name;
      if (typeof input.email === "string") fields.email = input.email;
      if (typeof input.phone === "string") fields.phone = input.phone;
      if (typeof input.eventType === "string") fields.eventType = input.eventType;
      if (typeof input.guestCount === "number") fields.guestCount = Math.round(input.guestCount);
      if (typeof input.location === "string") fields.location = input.location;
      if (typeof input.budgetRange === "string") fields.budgetRange = input.budgetRange;
      if (typeof input.notes === "string") fields.message = input.notes;
      if (typeof input.eventDate === "string") {
        const parsed = new Date(input.eventDate);
        if (!Number.isNaN(parsed.getTime())) fields.eventDate = parsed;
      }

      let lead;
      if (typeof input.leadId === "string" && input.leadId) {
        lead = await prisma.lead.update({ where: { id: input.leadId }, data: fields });
      } else {
        lead = await prisma.lead.create({
          data: { name: (fields.name as string) || "Website Visitor", source: "AI_CHAT", ...fields },
        });
      }

      const newStatus = nextLeadStatus(lead.status, lead);
      if (newStatus !== lead.status) {
        lead = await prisma.lead.update({ where: { id: lead.id }, data: { status: newStatus } });
      }

      return { result: { leadId: lead.id, status: lead.status }, leadIdOut: lead.id };
    }

    case "book_consultation": {
      const leadId = typeof input.leadId === "string" ? input.leadId : undefined;
      const date = typeof input.date === "string" ? input.date : undefined;
      const time = typeof input.time === "string" ? input.time : undefined;
      if (!leadId || !date || !time) {
        return { result: { error: "leadId, date, and time are all required." } };
      }

      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) return { result: { error: "Unknown lead — call save_inquiry first." } };

      const missing: string[] = [];
      if (!lead.name || lead.name === "Website Visitor") missing.push("name");
      if (!lead.email) missing.push("email");
      if (!lead.phone) missing.push("phone number");
      if (missing.length > 0) {
        return {
          result: {
            error: `Cannot confirm the booking yet — still missing the customer's ${missing.join(", ")}. Ask for ${
              missing.length > 1 ? "these" : "this"
            } before confirming anything is booked, then call book_consultation again.`,
            missingContactInfo: missing,
          },
        };
      }

      if (await isSlotTaken(date, time)) {
        return { result: { error: "That slot was just booked by someone else. Please choose another time.", conflict: true } };
      }

      const appointment = await prisma.appointment.create({
        data: {
          leadId,
          date: slotToDate(date, time),
          status: "CONFIRMED",
          notes: typeof input.notes === "string" ? input.notes : undefined,
        },
      });
      const updatedLead = await prisma.lead.update({ where: { id: leadId }, data: { status: "CONSULTATION_BOOKED" } });

      await Promise.all([
        notifyAdminByEmail(updatedLead, appointment),
        notifyCustomerByWhatsApp(updatedLead, appointment),
      ]);

      cards.push({ type: "confirmation", date, time, eventType: updatedLead.eventType });
      return { result: { confirmed: true, date, time, appointmentId: appointment.id }, leadIdOut: leadId };
    }

    case "reschedule_consultation": {
      const leadId = typeof input.leadId === "string" ? input.leadId : undefined;
      const date = typeof input.date === "string" ? input.date : undefined;
      const time = typeof input.time === "string" ? input.time : undefined;
      if (!leadId || !date || !time) {
        return { result: { error: "leadId, date, and time are all required." } };
      }

      const appointment = await prisma.appointment.findFirst({
        where: { leadId, status: { in: ["PENDING", "CONFIRMED"] } },
        orderBy: { date: "desc" },
      });
      if (!appointment) return { result: { error: "No active appointment found for this lead." } };
      if (await isSlotTaken(date, time)) {
        return { result: { error: "That slot is unavailable. Please choose another time.", conflict: true } };
      }

      await prisma.appointment.update({ where: { id: appointment.id }, data: { date: slotToDate(date, time) } });
      cards.push({ type: "confirmation", date, time, eventType: null });
      return { result: { confirmed: true, date, time } };
    }

    case "cancel_consultation": {
      const leadId = typeof input.leadId === "string" ? input.leadId : undefined;
      if (!leadId) return { result: { error: "leadId is required." } };

      const appointment = await prisma.appointment.findFirst({
        where: { leadId, status: { in: ["PENDING", "CONFIRMED"] } },
        orderBy: { date: "desc" },
      });
      if (!appointment) return { result: { error: "No active appointment found for this lead." } };

      await prisma.appointment.update({ where: { id: appointment.id }, data: { status: "CANCELLED" } });
      return { result: { cancelled: true } };
    }

    default:
      return { result: { error: `Unknown tool: ${name}` } };
  }
}

function isRetryableStatus(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  // 503 ("high demand") is a genuine transient blip worth a short retry. 429 (quota/rate
  // limit) is not — Gemini's free-tier daily quota won't reset within a couple of seconds,
  // so retrying it just delays the fallback response for no benefit.
  return status === 503;
}

/** Gemini occasionally returns a transient 503 ("high demand") — retry a couple of times
 * with backoff before giving up, so a momentary blip doesn't surface as a broken
 * conversation to the customer. */
async function generateWithRetry(params: Parameters<NonNullable<typeof genAI>["models"]["generateContent"]>[0]) {
  const delays = [500, 1500];
  for (let attempt = 0; ; attempt++) {
    try {
      return await genAI!.models.generateContent(params);
    } catch (err) {
      if (attempt >= delays.length || !isRetryableStatus(err)) throw err;
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
    }
  }
}

async function runConversation(system: string, history: ChatMessage[], message: string, locale: Locale) {
  const cards: Card[] = [];
  let leadId: string | undefined;

  if (!genAI) {
    return { reply: dictionaries[locale].chat.notConnected, leadId, cards };
  }

  const contents: Content[] = [
    ...history.slice(-10).map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
    { role: "user", parts: [{ text: message }] },
  ];

  for (let i = 0; i < 4; i++) {
    const response = await generateWithRetry({
      model: MODEL,
      contents,
      config: {
        systemInstruction: system,
        tools: [{ functionDeclarations: TOOLS }],
        maxOutputTokens: 700,
      },
    });

    const calls = response.functionCalls;
    if (!calls || calls.length === 0) {
      return { reply: response.text ?? dictionaries[locale].chat.defaultReply, leadId, cards };
    }

    const modelContent = response.candidates?.[0]?.content;
    if (modelContent) contents.push(modelContent);

    const responseParts: Content["parts"] = [];
    for (const call of calls) {
      if (!call.name) continue;
      const { result, leadIdOut } = await executeTool(call.name, call.args ?? {}, locale, cards);
      if (leadIdOut) leadId = leadIdOut;
      responseParts?.push({ functionResponse: { name: call.name, response: { result } } });
    }
    contents.push({ role: "user", parts: responseParts });
  }

  return { reply: dictionaries[locale].chat.followUp, leadId, cards };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const sessionId: string | undefined = body?.sessionId;
  const message: string | undefined = body?.message;
  const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];
  const locale: Locale = body?.locale === "fr" ? "fr" : "en";
  const clientLeadId: string | undefined = typeof body?.leadId === "string" ? body.leadId : undefined;
  const pendingSlot: { date: string; time: string } | undefined =
    typeof body?.pendingSlot?.date === "string" && typeof body?.pendingSlot?.time === "string"
      ? { date: body.pendingSlot.date, time: body.pendingSlot.time }
      : undefined;

  if (!sessionId || !message || typeof message !== "string" || message.length > 2000) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await prisma.chatLog.create({
    data: { sessionId, leadId: clientLeadId, role: "user", content: message },
  });

  const knowledgeBase = await prisma.appSetting.findUnique({ where: { key: "ai_knowledge_base" } });
  let system = knowledgeBase?.value
    ? `${SYSTEM_PROMPT}\n\nAdditional knowledge base notes from the Event Masterpiece Plus team:\n${knowledgeBase.value}`
    : SYSTEM_PROMPT;
  if (clientLeadId) {
    system += `\n\nThe current lead record ID for this conversation is "${clientLeadId}" — pass this as leadId to save_inquiry/book_consultation/reschedule_consultation/cancel_consultation instead of creating a new one, unless the customer is clearly starting a brand-new, unrelated inquiry.`;
  }
  if (pendingSlot) {
    system += `\n\nPENDING SLOT: The customer has already chosen this exact consultation slot from the real availability list — date "${pendingSlot.date}" (YYYY-MM-DD), time "${pendingSlot.time}" (24-hour HH:mm). Do not re-call check_consultation_availability or ask them to pick a date/time again for this booking. As soon as you have their name, email, and phone (saved via save_inquiry), call book_consultation with exactly this date and time. Only deviate if the customer explicitly asks for a different slot.`;
  }
  system += `\n\nTODAY'S DATE is ${new Date().toISOString().slice(0, 10)} — use this as your reference point for any relative date reasoning.`;
  system += `\n\nLANGUAGE: The visitor's site language is currently set to ${
    locale === "fr" ? "French" : "English"
  }. Reply entirely in ${
    locale === "fr" ? "French" : "English"
  } — every word, with no mixing of the other language — regardless of what language the visitor types in.`;

  let reply: string;
  let leadId = clientLeadId;
  let cards: Card[] = [];

  try {
    const result = await runConversation(system, history, message, locale);
    reply = result.reply;
    leadId = result.leadId ?? clientLeadId;
    cards = result.cards;
  } catch (err) {
    console.error("Gemini API error:", err);
    reply = dictionaries[locale].chat.apiError;
  }

  await prisma.chatLog.create({
    data: { sessionId, leadId, role: "assistant", content: reply },
  });

  return NextResponse.json({ reply, leadId, cards });
}
