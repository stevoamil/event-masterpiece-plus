"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M15 8h-2a2 2 0 0 0-2 2v10M8 12h6M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M16 3v10.5a3.5 3.5 0 1 1-3.5-3.5" strokeLinecap="round" />
      <path d="M16 3c0 2.5 2 4.5 4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

const socialLinks = [
  { Icon: InstagramIcon, href: "https://www.instagram.com/eventsby_marina/", label: "Instagram" },
  { Icon: TikTokIcon, href: "https://www.tiktok.com/@events.by.marina", label: "TikTok" },
  { Icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=61557619685304", label: "Facebook" },
];

export default function Footer() {
  const { dict } = useLocale();

  return (
    <footer className="relative overflow-hidden bg-beige-50 pt-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="grid gap-12 border-b border-ink-900/10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-flex flex-col items-center">
              <Image
                src="/images/logo-events-by-marina.avif"
                alt="Events By Marina"
                width={197}
                height={203}
                className="h-20 w-auto"
              />
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-900/60">{dict.footer.tagline}</p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-cursor-hover
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 transition hover:border-brass-500 hover:text-brass-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest2 text-ink-900/40">Contact</h4>
            <div className="mt-5 space-y-3 text-sm text-ink-900/70">
              <a href="mailto:hello@eventsbymarina.com" data-cursor-hover className="flex items-center gap-2 hover:text-brass-500">
                <Mail className="h-4 w-4" /> hello@eventsbymarina.com
              </a>
              <a href="tel:+19518708863" data-cursor-hover className="flex items-center gap-2 hover:text-brass-500">
                <Phone className="h-4 w-4" /> +1 951 870 8863
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> USA · Available Worldwide
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest2 text-ink-900/40">Studio</h4>
            <div className="mt-5 space-y-3 text-sm text-ink-900/70">
              <Link href="/#services" data-cursor-hover className="block hover:text-brass-500">
                {dict.nav.services}
              </Link>
              <Link href="/#portfolio" data-cursor-hover className="block hover:text-brass-500">
                {dict.nav.portfolio}
              </Link>
              <Link href="/#process" data-cursor-hover className="block hover:text-brass-500">
                {dict.nav.process}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest2 text-ink-900/40">Studio Access</h4>
            <div className="mt-5 space-y-3 text-sm text-ink-900/70">
              <a href="/admin" data-cursor-hover className="block hover:text-brass-500">
                {dict.footer.admin} →
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-xs text-ink-900/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Events By Marina. {dict.footer.rights}</span>
          <span>{dict.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
