"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CalendarClock,
  Contact,
  Images,
  Bot,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads / Inquiries", icon: Users },
  { href: "/admin/consultations", label: "Consultations", icon: CalendarClock },
  { href: "/admin/bookings", label: "Bookings / Calendar", icon: CalendarDays },
  { href: "/admin/clients", label: "Clients", icon: Contact },
  { href: "/admin/gallery", label: "Gallery / Portfolio", icon: Images },
  { href: "/admin/ai-logs", label: "AI Assistant Logs", icon: Bot },
  { href: "/admin/whatsapp", label: "WhatsApp Inbox", icon: MessageCircle },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex flex-col items-start gap-1 px-5 py-6">
        <Image
          src="/images/logo-events-by-marina-black.png"
          alt="Events By Marina"
          width={197}
          height={203}
          className="h-11 w-auto"
        />
        <p className="text-[10px] uppercase tracking-wide text-ink-700/50">Admin</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                active ? "bg-ink-900 text-beige-100" : "text-ink-700 hover:bg-ink-900/5"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-900/10 p-4">
        <p className="truncate text-xs font-medium text-ink-900">{user.name}</p>
        <p className="truncate text-[11px] text-ink-700/50">{user.email}</p>
        <button
          onClick={logout}
          className="mt-3 flex items-center gap-2 text-xs text-ink-700/60 hover:text-ink-900"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-beige-50 text-ink-900">
      <aside className="hidden w-64 flex-shrink-0 border-r border-ink-900/10 bg-beige-100 lg:block">
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-beige-100">{SidebarContent}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-900/10 bg-beige-50 px-5 py-3 lg:hidden">
          <span className="font-display text-sm italic">Events By Marina Admin</span>
          <button onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
