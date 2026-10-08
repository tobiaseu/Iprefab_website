"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark, UserIcon } from "./Icons";
import LoginModal from "./LoginModal";

const nav = [
  { href: "/houses", label: "Houses" },
  { href: "/magazine", label: "Magazine" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy text-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-7 w-10" />
          <span className="text-2xl font-bold">House Finland</span>
        </Link>

        <nav className="hidden items-center gap-12 lg:flex xl:gap-20">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base uppercase transition-opacity hover:opacity-80 ${active ? "font-semibold" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setLogin(true)} className="flex items-center gap-2 hover:opacity-80">
            <UserIcon className="size-6" />
            <span className="hidden sm:inline">Log In</span>
          </button>
          <button
            className="lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg viewBox="0 0 24 24" className="size-7" stroke="white" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-white/10 px-4 pb-4 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 uppercase"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      {login && <LoginModal onClose={() => setLogin(false)} />}
    </header>
  );
}
