"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { SocialIcon } from "./Icons";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useLang();
  const links = [
    { href: "/configure", label: t.nav.configure },
    { href: "/houses", label: t.nav.houses },
    { href: "/magazine", label: t.nav.magazine },
    { href: "/services", label: t.nav.services },
    { href: "/faq", label: t.nav.faq },
    { href: "/about", label: t.nav.about },
  ];
  return (
    <footer className="border-t border-white/10 bg-[#071438]/60 text-white backdrop-blur">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-4 py-16 md:px-8">
        <div className="col-span-12 md:col-span-5">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-auto" />
            <p className="text-2xl font-semibold">Iprefab</p>
          </div>
          <p className="mt-4 max-w-sm text-white/70">{t.footer.tagline}</p>
        </div>
        <nav className="col-span-12 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:col-span-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-white/80 hover:text-white">{l.label}</Link>
          ))}
        </nav>
        <div className="col-span-12 text-sm md:col-span-3">
          <p className="text-white/70">{t.footer.follow}</p>
          <div className="mt-3 flex gap-3">
            {(["instagram", "x", "youtube", "linkedin"] as const).map((s) => (
              <a key={s} href="#" aria-label={s} className="opacity-80 hover:opacity-100">
                <SocialIcon name={s} className="size-7" />
              </a>
            ))}
          </div>
          <p className="mt-6 text-white/70">{t.footer.partners}</p>
          <a href="https://iprefab.ai" className="mt-1 inline-block underline underline-offset-4">iprefab.ai</a>
        </div>
        <p className="col-span-12 border-t border-white/15 pt-6 text-xs text-white/50">© Iprefab. {t.footer.rights}</p>
      </div>
    </footer>
  );
}
