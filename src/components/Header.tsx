"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import LanguageToggle from "./LanguageToggle";
import LoginModal from "./LoginModal";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const dark = pathname === "/";
  const [login, setLogin] = useState(false);
  const nav = [
    { href: "/configure", label: t.nav.configure },
    { href: "/houses", label: t.nav.houses },
    { href: "/magazine", label: t.nav.magazine },
    { href: "/services", label: t.nav.services },
    { href: "/faq", label: t.nav.faq },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur ${dark ? "border-white/10 bg-[#071438]/90 text-white" : "border-navy/10 bg-paper/95"}`}>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-8 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo tone={dark ? "white" : "navy"} className="h-6 w-auto" />
          <span className="text-lg font-semibold tracking-tight">Iprefab</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors ${active ? dark ? "text-white" : "text-navy underline decoration-periwinkle decoration-2 underline-offset-8" : dark ? "text-white/70 hover:text-white" : "text-navy/70 hover:text-navy"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LanguageToggle dark={dark} />
          <button onClick={() => setLogin(true)} className={`hidden text-sm sm:block ${dark ? "text-white/70 hover:text-white" : "text-navy/70 hover:text-navy"}`}>
            {t.nav.login}
          </button>
          <button className="lg:hidden" aria-label={t.nav.menu} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" className="size-6" stroke="currentColor" strokeWidth="1.75" fill="none">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className={`flex flex-col border-t px-4 ${dark ? "border-white/10" : "border-navy/10"} pb-4 lg:hidden`}>
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
