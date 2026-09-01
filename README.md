# Event Masterpiece Plus — Event Planning & Design

A cinematic, scroll-driven marketing site plus a full admin dashboard for Event Masterpiece Plus LLC, an event planning & design studio.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Public site:** Three.js + `@react-three/fiber`, GSAP + ScrollTrigger, Lenis smooth scroll, Tailwind CSS
- **Database:** Prisma ORM, hosted Postgres (Prisma Postgres via Vercel Storage)
- **Auth:** Custom JWT session cookies (`jose` + `bcryptjs`) — no third-party auth service
- **AI assistant:** Google Gemini API, server-side proxy
- **Admin UI:** React + Tailwind, Recharts for charts

## Getting started

```bash
npm install
npx prisma db push   # syncs the schema to your Postgres database
npm run db:seed      # seeds demo data + accounts
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the dashboard.

**Demo admin login:** `eventmasterpiece1977@gmail.com` / `EventMasterpiecePlus2026!`
**Demo staff login:** `staff@eventmasterpieceplus.com` / `Staff2026!`

## What's fully working out of the box

- The entire public site (hero 3D particle scene, services, portfolio gallery + lightbox, process timeline, testimonials carousel, contact form, embedded map)
- French/English language toggle
- The full admin dashboard: leads pipeline, bookings calendar with conflict detection, clients, gallery manager (real file upload), AI chat logs, WhatsApp inbox, analytics, settings — all backed by a real database
- WhatsApp "click to chat" buttons (real `wa.me` deep links)
- Contact form → creates a real Lead record, visible immediately in the admin dashboard

## What needs your credentials to go fully live

Add these to `.env` (copy from `.env.example`):

| Feature | Env var(s) | Without it |
|---|---|---|
| AI concierge gives real answers | `GEMINI_API_KEY` | Chat widget shows a friendly fallback message and still logs to the admin dashboard |
| WhatsApp Business API two-way sync | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN` | wa.me buttons still work; admin replies save locally but aren't delivered |
| Email notifications on booking | `RESEND_API_KEY` | Booking still succeeds; no email sent |

## Going to production

- **File uploads:** the gallery manager currently saves images to `/public/uploads` on local disk — fine for local dev, but ephemeral on serverless hosts (e.g. Vercel). Swap `src/app/api/admin/gallery/upload/route.ts` for a cloud store (Vercel Blob, S3, Cloudinary) before deploying.
- **`AUTH_SECRET`:** set a strong random value in production (`openssl rand -base64 32`).
- **2FA:** not implemented in this version — noted as a follow-up if needed.
