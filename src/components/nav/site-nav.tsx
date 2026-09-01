"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Globe, Phone } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

const sectionIds = ["services", "portfolio", "process", "testimonials", "contact"] as const;

const PHONE_DISPLAY = "+1 951 870 8863";
const PHONE_HREF = "tel:+19518708863";

export default function SiteNav() {
  const { locale, setLocale, dict } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLabels = [dict.nav.services, dict.nav.portfolio, dict.nav.process, dict.nav.testimonials, dict.nav.contact];

  // Section anchors only exist on the homepage — from any other route,
  // navigate there first and let the hash scroll once it loads.
  function scrollTo(id: string) {
    setOpen(false);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  }

  function toggleLang() {
    setLocale(locale === "en" ? "fr" : "en");
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10">
        <a
          href={pathname === "/" ? "#top" : "/"}
          data-cursor-hover
          className="flex items-center gap-2.5"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("top");
          }}
        >
          <Image
            src="/images/logo-events-by-marina-black.png"
            alt="Events By Marina"
            width={197}
            height={203}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {sectionIds.map((id, i) => (
            <button
              key={id}
              data-cursor-hover
              onClick={() => scrollTo(id)}
              className="relative text-[13px] font-medium uppercase tracking-widest2 text-ink-900/80 transition hover:text-brass-500"
            >
              {navLabels[i]}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={PHONE_HREF}
            data-cursor-hover
            className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-ink-900/70 hover:text-brass-500"
          >
            <Phone className="h-3.5 w-3.5" />
            {PHONE_DISPLAY}
          </a>
          <button
            data-cursor-hover
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest2 text-ink-900/70 hover:text-brass-500"
          >
            <Globe className="h-3.5 w-3.5" />
            {locale === "en" ? "FR" : "EN"}
          </button>
        </div>

        <button data-cursor-hover className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink-900 px-8 py-8 text-beige-50 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/logo-events-by-marina-black.png"
                  alt="Events By Marina"
                  width={197}
                  height={203}
                  className="h-14 w-auto"
                />
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-16 flex flex-1 flex-col gap-8">
              {sectionIds.map((id, i) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-left font-display text-4xl italic text-beige-50"
                >
                  {navLabels[i]}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <a href={PHONE_HREF} className="flex items-center gap-2 text-sm tracking-wide text-beige-50/70">
                <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
              </a>
              <button onClick={toggleLang} className="flex items-center gap-2 text-sm uppercase tracking-widest2 text-beige-50/70">
                <Globe className="h-4 w-4" /> {locale === "en" ? "Français" : "English"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
