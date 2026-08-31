import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import SettingsPanel from "@/components/admin/settings-panel";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [session, users, kbSetting, notifSetting] = await Promise.all([
    getSession(),
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.appSetting.findUnique({ where: { key: "ai_knowledge_base" } }),
    prisma.appSetting.findUnique({ where: { key: "email_notifications" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Settings</h1>
        <p className="text-sm text-ink-700/60">Team, AI assistant behavior, notifications, and integrations.</p>
      </div>
      <SettingsPanel
        users={users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }))}
        integrations={{
          gemini: Boolean(process.env.GEMINI_API_KEY),
          whatsapp: Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
          resend: Boolean(process.env.RESEND_API_KEY),
        }}
        initialKnowledgeBase={kbSetting?.value ?? ""}
        initialEmailNotifications={notifSetting?.value === "true"}
        currentUserId={session!.userId}
        currentUserRole={session!.role}
      />
    </div>
  );
}
