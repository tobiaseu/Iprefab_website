"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { houses } from "@/data/houses";
import { useLang } from "@/i18n/LanguageProvider";
import HouseCard from "./HouseCard";
import Marquee from "./Marquee";
import NewsletterForm from "./NewsletterForm";

const wordmarks = [
  { name: "Finnlamelli", className: "font-semibold tracking-tight" },
  { name: "Designtalo", className: "font-light tracking-wide" },
  { name: "Honka", className: "font-bold tracking-[0.12em]" },
  { name: "Okal", className: "font-medium italic" },
  { name: "Salvos", className: "font-normal tracking-tight" },
];
const builders = [...new Set(houses.map((h) => h.builder))];
const sizes = [80, 100, 120, 150];
const budgets = [200000, 250000, 300000, 400000];
const suggested = ["poutta-155", "ideal-133", "rehti-89", "aava-140", "ideal-105", "shine-133"].map((slug) => houses.find((h) => h.slug === slug)!);

function useTypewriter(lines: string[]) {
  const [text, setText] = useState(lines[0]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let line = 0;
    let i = 0;
    let pause = 0;
    const id = window.setInterval(() => {
      if (pause > 0) return void pause--;
      i++;
      if (i > lines[line].length) {
        line = (line + 1) % lines.length;
        i = 0;
        pause = 4;
      }
      setText(lines[line].slice(0, i) || " ");
      if (i === lines[line].length) pause = 60;
    }, 45);
    return () => window.clearInterval(id);
  }, [lines]);
  return text;
}

function Pill({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="relative inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] text-xs text-white/75 transition-colors hover:border-white/25 focus-within:border-white/40">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="cursor-pointer appearance-none bg-transparent py-1.5 pr-7 pl-3 outline-none">
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0d1c4a] text-white">{o.label}</option>
        ))}
      </select>
      <svg viewBox="0 0 12 12" className="pointer-events-none absolute right-2.5 size-3 text-white/50" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M3 4.5 6 7.5 9 4.5" /></svg>
    </label>
  );
}

const iconBtn = "grid size-9 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white";

export default function HomeContent() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [text, setText] = useState("");
  const [builder, setBuilder] = useState("");
  const [size, setSize] = useState("");
  const [budget, setBudget] = useState("");
  const placeholder = useTypewriter(t.home.placeholders);
  const fmt = (n: number) => new Intl.NumberFormat(lang === "fi" ? "fi-FI" : "en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  const go = (prompt: string) => {
    const extra = [size && `${size} m²`, budget && `${lang === "fi" ? "alle" : "under"} ${fmt(+budget)}`, builder].filter(Boolean).join(", ");
    const q = [prompt.trim(), extra].filter(Boolean).join(", ");
    router.push(q ? `/configure?q=${encodeURIComponent(q)}` : "/configure");
  };

  return (
    <div className="overflow-x-clip bg-[#071438] text-white">
      <section className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-3xl flex-col items-center justify-center px-4 py-16">
        <h1 className="text-center text-4xl font-semibold tracking-tight text-balance md:text-6xl">{t.home.greet}</h1>
        <p className="mt-4 max-w-xl text-center text-base text-pretty text-white/60 md:text-lg">{t.home.greetLead}</p>

        <form
          className="relative mt-10 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            go(text);
          }}
        >
          <div aria-hidden className="composer-glow pointer-events-none absolute -inset-6 rounded-[40px] opacity-70 blur-2xl" />
          <div className="relative rounded-[28px] border border-white/10 bg-[#0d1c4a] p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] transition-colors focus-within:border-white/25">
            <label htmlFor="composer" className="sr-only">{t.home.composerLabel}</label>
            <textarea
              id="composer"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  go(text);
                }
              }}
              placeholder={placeholder}
              className="block w-full resize-none bg-transparent px-3 pt-2 text-base text-white outline-none placeholder:text-white/40 md:text-lg"
            />
            <div className="mt-2 flex items-center gap-1">
              <button type="button" className={iconBtn} aria-label={t.home.attach} title={t.home.attach}>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7L14 4.5a3.3 3.3 0 0 1 4.7 4.7L10.2 17.7a1.7 1.7 0 0 1-2.4-2.4L15.5 7.6" /></svg>
              </button>
              <button type="button" className={iconBtn} aria-label={t.home.mic} title={t.home.mic}>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></svg>
              </button>
              <button type="submit" aria-label={t.home.send} title={t.home.send} className="ml-auto grid size-10 place-items-center rounded-full bg-white text-[#071438] transition-colors hover:bg-[#c9d1f0]">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
              </button>
            </div>
          </div>
          <div className="relative mt-3 flex flex-wrap gap-2 px-1">
            <Pill label={t.home.anyBuilder} value={builder} onChange={setBuilder} options={[{ value: "", label: t.home.anyBuilder }, ...builders.map((b) => ({ value: b, label: b }))]} />
            <Pill label={t.home.sizeChip} value={size} onChange={setSize} options={[{ value: "", label: t.home.sizeChip }, ...sizes.map((s) => ({ value: String(s), label: `${s} m²` }))]} />
            <Pill label={t.home.budgetChip} value={budget} onChange={setBudget} options={[{ value: "", label: t.home.budgetChip }, ...budgets.map((b) => ({ value: String(b), label: `${lang === "fi" ? "alle" : "under"} ${fmt(b)}` }))]} />
          </div>
        </form>

        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {t.home.suggestions.map((s) => (
            <li key={s}>
              <button type="button" onClick={() => go(s)} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white">
                {s}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-8 pb-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{t.home.suggestedTitle}</h2>
            <p className="mt-2 text-white/60">{t.home.suggestedLead}</p>
          </div>
          <Link href="/houses" className="text-sm text-white/70 underline underline-offset-4 hover:text-white">{t.home.viewAll}</Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex snap-x gap-5 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
          {suggested.map((h) => (
            <div key={h.slug} className="flex snap-start">
              <HouseCard house={h} size="sm" dark />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{t.home.buildersTitle}</h2>
          <p className="mt-2 max-w-md text-white/60">{t.home.buildersLead}</p>
        </div>
        <Marquee duration={50} className="mt-12">
          {wordmarks.map((w) => (
            <span key={w.name} className={`px-10 text-5xl whitespace-nowrap text-white/20 md:px-16 md:text-7xl ${w.className}`}>{w.name}</span>
          ))}
        </Marquee>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-6 px-4 py-20 md:px-8">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{t.home.newsTitle}</h2>
            <p className="mt-2 max-w-sm text-white/60">{t.home.newsLead}</p>
          </div>
          <NewsletterForm dark className="col-span-12 self-end lg:col-span-6 lg:col-start-7" />
        </div>
      </section>
    </div>
  );
}
