"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export default function Footer() {
  const { dict } = useLocale();

  return (
    <footer className="relative overflow-hidden bg-beige-50 pt-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="grid gap-12 border-b border-ink-900/10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-flex flex-col items-center">
              <Image
                src="/images/logo-emp-transparent.png"
                alt="Event Masterpiece Plus"
                width={963}
                height={718}
                className="h-20 w-auto"
              />
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-900/60">{dict.footer.tagline}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest2 text-ink-900/40">Contact</h4>
            <div className="mt-5 space-y-3 text-sm text-ink-900/70">
              <a href="mailto:eventmasterpiece1977@gmail.com" data-cursor-hover className="flex items-center gap-2 hover:text-brass-500">
                <Mail className="h-4 w-4" /> eventmasterpiece1977@gmail.com
              </a>
              <a href="tel:+13025009067" data-cursor-hover className="flex items-center gap-2 hover:text-brass-500">
                <Phone className="h-4 w-4" /> +1 302 500-9067
              </a>
              <a
                href="https://www.google.com/maps?q=186+Conach+Lane,+Clayton,+DE+19938,+USA"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="flex items-center gap-2 hover:text-brass-500"
              >
                <MapPin className="h-4 w-4" /> 186 Conach Lane, Clayton, DE 19938
              </a>
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
          <span>© {new Date().getFullYear()} Event Masterpiece Plus LLC. {dict.footer.rights}</span>
          <span>{dict.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
