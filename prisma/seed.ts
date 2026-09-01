import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("EventMasterpiecePlus2026!", 10);
  await prisma.user.upsert({
    where: { email: "eventmasterpiece1977@gmail.com" },
    update: {},
    create: {
      name: "Event Masterpiece Plus",
      email: "eventmasterpiece1977@gmail.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const staffPassword = await bcrypt.hash("Staff2026!", 10);
  await prisma.user.upsert({
    where: { email: "staff@eventmasterpieceplus.com" },
    update: {},
    create: {
      name: "Jordan Blake",
      email: "staff@eventmasterpieceplus.com",
      password: staffPassword,
      role: "STAFF",
    },
  });

  const gallery = [
    { title: "Rosewood Garden Wedding", category: "Weddings", imageUrl: "/images/about-3.webp", order: 1 },
    { title: "Skyline Corporate Gala", category: "Corporate Events", imageUrl: "/images/about-4.webp", order: 2 },
    { title: "Hillside Villa Soirée", category: "Private Parties", imageUrl: "/images/about-2.png", order: 4 },
    { title: "Petal & Lace Baby Shower", category: "Baby Showers", imageUrl: "/images/about-3.webp", order: 5 },
    { title: "Moonlit Vow Renewal", category: "Weddings", imageUrl: "/images/about-4.webp", order: 6 },
    { title: "Oceanview Cliffside Wedding", category: "Weddings", imageUrl: "/images/portfolio/sunset-cliffside-wedding.png", order: 7 },
    { title: "Terrace Engagement Surprise", category: "Engagements", imageUrl: "/images/portfolio/rooftop-engagement-proposal.png", order: 8 },
    { title: "Garden Table Family Gathering", category: "Family Events", imageUrl: "/images/portfolio/garden-family-dinner.png", order: 9 },
  ];
  for (const g of gallery) {
    const existing = await prisma.galleryItem.findFirst({ where: { title: g.title } });
    if (!existing) await prisma.galleryItem.create({ data: g });
  }

  const testimonials = [
    { name: "Ava & Noah", eventType: "Wedding", quote: "The team brought our vision to life beyond what we imagined — every detail was perfect.", rating: 5, order: 1 },
    { name: "Daniela Reyes", eventType: "Corporate Gala", quote: "Seamless from start to finish. Our guests are still talking about it.", rating: 5, order: 2 },
    { name: "The Whitfield Family", eventType: "Anniversary", quote: "Warm, elegant, and effortless — exactly what we hoped for.", rating: 5, order: 3 },
  ];
  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, eventType: t.eventType } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }

  const clients = [
    { name: "Ava Bennett", email: "ava.b@example.com", phone: "+1 415 555 0132" },
    { name: "Daniela Reyes", email: "daniela.reyes@example.com", phone: "+1 212 555 0187" },
  ];
  const createdClients = [];
  for (const c of clients) {
    const existing = await prisma.client.findFirst({ where: { email: c.email } });
    createdClients.push(existing ?? (await prisma.client.create({ data: c })));
  }

  const leads = [
    { name: "Ava Bennett", email: "ava.b@example.com", phone: "+1 415 555 0132", eventType: "Wedding", guestCount: 120, budgetRange: "$30k–$50k", status: "CONSULTATION_BOOKED" as const, source: "WEBSITE_FORM" as const, message: "Looking for a spring wedding near Napa Valley." },
    { name: "Marcus Ellison", email: "marcus.e@example.com", phone: "+1 646 555 0143", eventType: "Corporate Event", guestCount: 300, budgetRange: "$50k+", status: "PROPOSAL_SENT" as const, source: "AI_CHAT" as const, message: "Annual gala for 300 guests, need AV and stage design." },
    { name: "Priya Shah", email: "priya.s@example.com", phone: "+1 312 555 0198", eventType: "Baby Shower", guestCount: 25, budgetRange: "$5k–$10k", status: "NEW" as const, source: "WHATSAPP" as const, message: "Hi Event Masterpiece Plus, I'd like to inquire about an event." },
    { name: "Tyler Simmons", email: "tyler.s@example.com", phone: "+1 305 555 0176", eventType: "Private Party", guestCount: 60, budgetRange: "$10k–$20k", status: "QUALIFIED" as const, source: "WEBSITE_FORM" as const, message: "40th birthday, looking for a rooftop venue." },
    { name: "Daniela Reyes", email: "daniela.reyes@example.com", phone: "+1 212 555 0187", eventType: "Corporate Event", guestCount: 150, budgetRange: "$30k–$50k", status: "WON" as const, source: "WEBSITE_FORM" as const, message: "Board gala, completed last quarter." },
  ];
  const createdLeads = [];
  for (const l of leads) {
    const existing = await prisma.lead.findFirst({ where: { email: l.email } });
    createdLeads.push(existing ?? (await prisma.lead.create({ data: l })));
  }

  const bookingSeed = [
    { leadIdx: 0, clientIdx: 0, eventName: "Bennett Spring Wedding", eventType: "Wedding", eventDate: new Date("2026-05-16"), location: "Auberge du Soleil, Napa Valley, CA", guestCount: 120, status: "CONFIRMED" as const },
    { leadIdx: 4, clientIdx: 1, eventName: "Reyes Board Gala", eventType: "Corporate Event", eventDate: new Date("2026-02-10"), location: "The Rainbow Room, New York, NY", guestCount: 150, status: "COMPLETED" as const },
  ];
  for (const b of bookingSeed) {
    const lead = createdLeads[b.leadIdx];
    const existing = await prisma.booking.findFirst({ where: { eventName: b.eventName } });
    if (!existing) {
      await prisma.booking.create({
        data: {
          eventName: b.eventName,
          eventType: b.eventType,
          eventDate: b.eventDate,
          location: b.location,
          guestCount: b.guestCount,
          status: b.status,
          leadId: lead?.id,
          clientId: createdClients[b.clientIdx]?.id,
        },
      });
    }
  }

  const priyaLead = createdLeads[2];
  const chatSession = "seed-session-1";
  const chatSeed = [
    { role: "assistant", content: "Hi there! I'm the Event Masterpiece Plus concierge. How can I help you plan your event?" },
    { role: "user", content: "Hi Event Masterpiece Plus, I'd like to inquire about an event." },
    { role: "assistant", content: "Wonderful! What type of event are you planning, and roughly how many guests?" },
    { role: "user", content: "A baby shower for about 25 people, sometime in June." },
  ];
  for (const c of chatSeed) {
    const existing = await prisma.chatLog.findFirst({ where: { sessionId: chatSession, content: c.content } });
    if (!existing) {
      await prisma.chatLog.create({ data: { sessionId: chatSession, role: c.role, content: c.content, leadId: priyaLead?.id } });
    }
  }

  const waSeed = [
    { waId: "14155550198", fromName: "Priya Shah", direction: "in", body: "Hi Event Masterpiece Plus, I'd like to inquire about an event." },
    { waId: "14155550198", fromName: "Priya Shah", direction: "out", body: "Hi Priya! Happy to help — could you share your event date and guest count?" },
  ];
  for (const w of waSeed) {
    const existing = await prisma.whatsAppMessage.findFirst({ where: { waId: w.waId, body: w.body } });
    if (!existing) await prisma.whatsAppMessage.create({ data: w });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
