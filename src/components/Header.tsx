"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const nav = [
    { href: "/configure", label: t.nav.configure },
    { href: "/houses", label: t.nav.houses },
    { href: "/magazine", label: t.nav.magazine },
    { href: "/services", label: t.nav.services },
    { href: "/faq", label: t.nav.faq },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#071438]/80 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo tone="white" className="h-6 w-auto" />
          <span className="text-lg font-semibold tracking-tight">Iprefab</span>
        </Link>

        <nav className="glass absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full p-1 xl:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${active ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" : "text-white/70 hover:text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageToggle dark />
          <button onClick={() => setLogin(true)} className="glass hidden rounded-full px-4 py-2 text-sm text-white/85 hover:bg-white/10 sm:block">
            {t.nav.login}
          </button>
          <Link href="/configure" className="hidden items-center gap-2.5 rounded-full bg-[#4a5cf0] py-1 pr-1 pl-4 text-sm font-medium transition-colors hover:bg-[#5b6cf0] md:inline-flex">
            {t.home.cta}<ArrowCircle className="!size-7" />
          </Link>
          <button className="grid size-9 place-items-center rounded-full xl:hidden" aria-label={t.nav.menu} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" className="size-6" stroke="currentColor" strokeWidth="1.75" fill="none">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-white/10 px-4 pb-4 xl:hidden">
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
