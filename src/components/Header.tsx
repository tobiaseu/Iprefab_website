"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import LanguageToggle from "./LanguageToggle";
import LoginModal from "./LoginModal";
import Logo from "./Logo";
import { ArrowCircle } from "./Icons";

export default function Header() {
  const pathname = usePathname();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const nav = [
    { href: "/configure", label: t.nav.configure },
    { href: "/houses", label: t.nav.houses },
    { href: "/magazine", label: t.nav.magazine },
    { href: "/services", label: t.nav.services },
    { href: "/faq", label: t.nav.faq },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className={`sticky top-0 z-40 text-white transition-[background-color,backdrop-filter] duration-300 ${scrolled || open ? "bg-[#060b1a]/55 backdrop-blur-md" : "bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 md:h-20 md:px-8 xl:gap-4">
        <Link href="/" className="mr-auto flex h-10 shrink-0 items-center gap-2.5">
          <Logo tone="white" className="h-6 w-auto" />
          <span className="text-lg font-semibold tracking-tight">Iprefab</span>
        </Link>

        <nav className="glass hidden h-10 shrink-0 items-center gap-0.5 rounded-full p-1 min-[1080px]:flex 2xl:gap-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-8 items-center rounded-full px-2.5 text-sm whitespace-nowrap transition-colors xl:px-3.5 2xl:px-4 ${active ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" : "text-white/70 hover:text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 xl:gap-3">
          <LanguageToggle dark />
          <button onClick={() => setLogin(true)} className="glass hidden h-10 items-center rounded-full px-4 text-sm whitespace-nowrap sm:flex text-white/85 hover:bg-white/10">
            {t.nav.login}
          </button>
          <Link href="/configure" className="hidden h-10 items-center gap-2.5 rounded-full bg-[#4a5cf0] pr-1.5 pl-4 text-sm whitespace-nowrap font-medium transition-colors hover:bg-[#5b6cf0] md:inline-flex">
            {t.home.cta}<ArrowCircle className="!size-7" />
          </Link>
          <button className="grid size-10 place-items-center rounded-full min-[1080px]:hidden" aria-label={t.nav.menu} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" className="size-6" stroke="currentColor" strokeWidth="1.75" fill="none">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-white/10 bg-[#060b1a]/90 px-4 pb-4 min-[1080px]:hidden">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-3">
              {item.label}
            </Link>
          ))}
          <button onClick={() => { setOpen(false); setLogin(true); }} className="py-3 text-left sm:hidden">
            {t.nav.login}
          </button>
        </nav>
      )}

      {login && <LoginModal onClose={() => setLogin(false)} />}
    </header>
  );
}
