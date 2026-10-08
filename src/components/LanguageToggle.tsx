"use client";

import { useLang, type Lang } from "@/i18n/LanguageProvider";

function UkFlag() {
  return (
    <svg viewBox="0 0 30 30" className="size-6 rounded-full" aria-hidden="true">
      <clipPath id="uk-circle"><circle cx="15" cy="15" r="15" /></clipPath>
      <g clipPath="url(#uk-circle)">
        <rect width="30" height="30" fill="#012169" />
        <path d="M0,0 L30,30 M30,0 L0,30" stroke="#fff" strokeWidth="5" />
        <path d="M0,0 L30,30 M30,0 L0,30" stroke="#C8102E" strokeWidth="2" />
        <path d="M15,0 v30 M0,15 h30" stroke="#fff" strokeWidth="8" />
        <path d="M15,0 v30 M0,15 h30" stroke="#C8102E" strokeWidth="4.5" />
      </g>
    </svg>
  );
}

function FiFlag() {
  return (
    <svg viewBox="0 0 30 30" className="size-6 rounded-full ring-1 ring-navy/20" aria-hidden="true">
      <clipPath id="fi-circle"><circle cx="15" cy="15" r="15" /></clipPath>
      <g clipPath="url(#fi-circle)">
        <rect width="30" height="30" fill="#fff" />
        <rect x="9" width="6" height="30" fill="#002F6C" />
        <rect y="12" width="30" height="6" fill="#002F6C" />
      </g>
    </svg>
  );
}

export default function LanguageToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang, t } = useLang();
  const options: { value: Lang; label: string; flag: React.ReactNode }[] = [
    { value: "fi", label: "Suomi", flag: <FiFlag /> },
    { value: "en", label: "English", flag: <UkFlag /> },
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
          className={`grid size-8 place-items-center rounded-full transition-opacity ${lang === o.value ? `opacity-100 ring-2 ${dark ? "ring-white/40" : "ring-navy/30"}` : "opacity-60 hover:opacity-100"}`}
        >
          {o.flag}
        </button>
      ))}
    </div>
  );
}
