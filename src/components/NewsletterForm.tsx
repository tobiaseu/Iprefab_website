"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";

export default function NewsletterForm({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  if (done) return <p className={`${dark ? "text-[#aab6e6]" : "text-moss"} ${className}`}>{t.newsletter.thanks}</p>;
  return (
    <form
      className={`flex flex-col gap-3 sm:flex-row ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <label className="sr-only" htmlFor="nl-email">{t.newsletter.label}</label>
      <input
        id="nl-email"
        type="email"
        required
        placeholder={t.newsletter.placeholder}
        className={`min-w-0 flex-1 bg-transparent py-3 outline-none ${dark ? "rounded-full border border-white/15 bg-white/5 px-5 text-white placeholder:text-white/40 focus:border-white/50" : "border-b border-navy/30 placeholder:text-slate focus:border-navy"}`}
      />
      <button type="submit" className={dark ? "rounded-full bg-white px-6 py-3 font-medium text-[#071438] transition-colors hover:bg-[#c9d1f0]" : "bg-navy px-6 py-3 font-medium text-paper transition-colors hover:bg-periwinkle"}>
        {t.newsletter.submit}
      </button>
    </form>
  );
}
