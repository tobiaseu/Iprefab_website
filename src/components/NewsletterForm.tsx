"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";

export default function NewsletterForm({ className = "" }: { className?: string }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  if (done) return <p className={`text-moss ${className}`}>{t.newsletter.thanks}</p>;
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
        className="min-w-0 flex-1 border-b border-navy/30 bg-transparent py-3 outline-none placeholder:text-slate focus:border-navy"
      />
      <button type="submit" className="bg-navy px-6 py-3 font-medium text-paper transition-colors hover:bg-periwinkle">
        {t.newsletter.submit}
      </button>
    </form>
  );
}
