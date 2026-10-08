"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserIcon } from "./Icons";
import Logo from "./Logo";
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
      <div className="mx-auto grid h-20 max-w-[1440px] grid-cols-[1fr_auto] items-center px-4 md:px-8 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="flex items-center gap-3 justify-self-start">
          <Logo className="h-8 w-auto" />
          <span className="text-xl font-bold tracking-tight">House Finland</span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex xl:gap-14">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-medium tracking-wide uppercase transition-opacity after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-periwinkle after:transition-transform ${active ? "after:scale-x-100" : "opacity-80 after:scale-x-0 hover:opacity-100 hover:after:scale-x-100"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 justify-self-end">
          <button onClick={() => setLogin(true)} className="flex items-center gap-2 rounded-full border border-white/20 py-1.5 pr-4 pl-1.5 text-sm font-medium transition hover:bg-white/10">
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
