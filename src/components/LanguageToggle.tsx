"use client";

import { useLang, type Lang } from "@/i18n/LanguageProvider";

function UkFlag() {
  return (
    <svg viewBox="0 0 60 30" className="h-3.5 w-7 outline outline-1 outline-navy/20" aria-hidden="true">
      <clipPath id="uk-clip"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FiFlag() {
  return (
    <svg viewBox="0 0 18 11" className="h-3.5 w-[23px] outline outline-1 outline-navy/20" aria-hidden="true">
      <rect width="18" height="11" fill="#fff" />
      <rect x="5" width="3" height="11" fill="#002F6C" />
      <rect y="4" width="18" height="3" fill="#002F6C" />
    </svg>
  );
}

export default function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  const options: { value: Lang; label: string; flag: React.ReactNode }[] = [
    { value: "en", label: "English", flag: <UkFlag /> },
    { value: "fi", label: "Suomi", flag: <FiFlag /> },
  ];
  return (
    <div role="group" aria-label={t.nav.language} className="flex items-center gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLang(o.value)}
          aria-pressed={lang === o.value}
          aria-label={o.label}
          title={o.label}
          className={`grid h-8 w-10 place-items-center rounded-sm transition-opacity ${lang === o.value ? "opacity-100 ring-1 ring-navy/30" : "opacity-40 hover:opacity-80"}`}
        >
          {o.flag}
        </button>
      ))}
    </div>
  );
}
