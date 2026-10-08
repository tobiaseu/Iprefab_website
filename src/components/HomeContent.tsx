"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { houses } from "@/data/houses";
import { useLang } from "@/i18n/LanguageProvider";
import HouseCard from "./HouseCard";
import Marquee from "./Marquee";
import NewsletterForm from "./NewsletterForm";
import { ArrowCircle } from "./Icons";

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

function Sparkle({ className = "size-4" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>;
}

const featureIcons = [
  <path key="a" d="M4 6h16v10H8l-4 4zM8 10h8M8 13h5" />,
  <path key="b" d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5" />,
  <path key="c" d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6" />,
];

function Chip({ i }: { i: number }) {
  return (
    <span className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{featureIcons[i]}</svg>
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/85 uppercase">{children}</span>;
}

/** Thin angled framing lines (decorative). */
function Frame({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none" stroke="white" strokeOpacity="0.12" vectorEffect="non-scaling-stroke">
      <path d="M0 160H230L330 260H520" vectorEffect="non-scaling-stroke" />
      <path d="M1440 160H1210L1110 260H920" vectorEffect="non-scaling-stroke" />
      <path d="M0 330H120L200 400H330" vectorEffect="non-scaling-stroke" />
      <path d="M1440 330H1320L1240 400H1110" vectorEffect="non-scaling-stroke" />
      <path d="M0 520L250 600M1440 520L1190 600" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MiniHouse({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 130" className={className} fill="none" aria-hidden>
      <path d="M0 118h200" stroke="white" strokeOpacity=".25" />
      <path d="M30 118V64l55-38 55 38v54z" fill="#5b6cf0" fillOpacity=".25" stroke="#c9d1ff" strokeWidth="1.5" />
      <path d="M140 118V78h40v40z" fill="#5b6cf0" fillOpacity=".15" stroke="#c9d1ff" strokeOpacity=".7" />
      <path d="M22 70 85 26l63 44" stroke="white" strokeWidth="2" />
      <rect x="45" y="80" width="22" height="18" fill="#c9d1ff" fillOpacity=".5" />
      <rect x="102" y="80" width="22" height="18" fill="#c9d1ff" fillOpacity=".5" />
      <rect x="76" y="92" width="16" height="26" fill="white" fillOpacity=".7" />
      <rect x="150" y="88" width="20" height="14" fill="#c9d1ff" fillOpacity=".4" />
    </svg>
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
  const h = t.home;

  const taRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const go = (prompt: string) => {
    const q = prompt.trim();
    router.push(q ? `/configure?q=${encodeURIComponent(q)}` : "/configure");
  };

  const has = (s: string) => !!s && text.toLowerCase().includes(s.toLowerCase());

  // Remove a phrase (and a neighbouring comma) from the prompt.
  const strip = (src: string, s: string) => {
    if (!s) return src;
    const i = src.toLowerCase().indexOf(s.toLowerCase());
    if (i < 0) return src;
    return (src.slice(0, i) + src.slice(i + s.length)).replace(/\s*,\s*,/g, ",").replace(/^\s*,\s*|\s*,\s*$/g, "").trim();
  };

  // Type a phrase into the textarea at the cursor (or at the end).
  const insert = (phrase: string, base = text) => {
    window.clearInterval(timer.current);
    const el = taRef.current;
    const pos = el && document.activeElement === el ? el.selectionStart : base.length;
    const before = base.slice(0, pos).replace(/\s+$/, "");
    const after = base.slice(pos).replace(/^\s+/, "");
    const lead = before ? (/[,.;:]$/.test(before) ? " " : ", ") : "";
    const tail = after ? (/^[,.;:]/.test(after) ? "" : ", ") : "";
    const head = before + lead;
    const done = () => {
      const caret = head.length + phrase.length;
      requestAnimationFrame(() => {
        el?.focus();
        el?.setSelectionRange(caret, caret);
      });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(head + phrase + tail + after);
      return done();
    }
    let n = 0;
    timer.current = window.setInterval(() => {
      n++;
      setText(head + phrase.slice(0, n) + (n >= phrase.length ? tail + after : after ? " " + after : ""));
      if (n >= phrase.length) {
        window.clearInterval(timer.current);
        done();
      }
    }, 22);
  };

  const toggle = (s: string) => (has(s) ? setText((v) => strip(v, s)) : insert(s));
  const sizeLabel = (v: string) => (v ? `${v} m²` : "");
  const budgetLabel = (v: string) => (v ? `${lang === "fi" ? "alle" : "under"} ${fmt(+v)}` : "");
  const pick = (prev: string, next: string, set: (v: string) => void) => {
    set(next);
    const base = strip(text, prev);
    if (next) insert(next, base);
    else setText(base);
  };

  return (
    <div className="lyra-bg relative overflow-x-clip text-white">
      {/* Hero */}
      <section className="relative">
        <Frame className="hidden md:block" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-16 pb-10 text-center md:pt-24">
          <Badge><span className="grid size-5 place-items-center rounded-full bg-white/10 text-[#c9d1ff]"><Sparkle className="size-3" /></span>{h.badge}</Badge>
          <h1 className="mt-6 text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance md:text-7xl">
            {h.h1a} <span className="text-[#aeb9ff]">{h.h1b}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-pretty text-white/65 md:text-lg">{h.sub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/configure" className="inline-flex items-center gap-3 rounded-full bg-[#4a5cf0] py-1.5 pr-1.5 pl-6 font-medium shadow-[0_10px_30px_-10px_#4a5cf0] transition-colors hover:bg-[#5b6cf0]">
              {h.cta}<ArrowCircle />
            </Link>
            <Link href="/houses" className="glass inline-flex items-center rounded-full px-6 py-2.5 font-medium transition-colors hover:bg-white/10">{h.browseShort}</Link>
          </div>
          <ul className="mt-14 grid w-full max-w-4xl gap-8 md:grid-cols-3 md:gap-0">
            {h.features.map((f, i) => (
              <li key={f.t} className={`flex flex-col items-center px-6 ${i ? "md:border-l md:border-white/10" : ""}`}>
                <Chip i={i} />
                <h2 className="mt-4 font-medium">{f.t}</h2>
                <p className="mt-2 text-sm text-white/55">{f.d}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Composer in a browser frame */}
        <div className="relative mx-auto max-w-4xl px-4 pb-16">
          <div aria-hidden className="composer-glow pointer-events-none absolute inset-x-4 -inset-y-4 rounded-[40px] opacity-60 blur-3xl" />
          <div className="glass relative overflow-hidden rounded-3xl !bg-[#0b1846]/80">
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="flex gap-1.5" aria-hidden><i className="size-3 rounded-full bg-[#ff5f57]" /><i className="size-3 rounded-full bg-[#febc2e]" /><i className="size-3 rounded-full bg-[#28c840]" /></span>
              <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-lg bg-white/[0.07] px-4 py-1 text-xs text-white/60 sm:w-1/2 sm:justify-center">
                <svg viewBox="0 0 24 24" className="size-3" fill="currentColor" aria-hidden><path d="M7 10V7a5 5 0 0 1 10 0v3h1v11H6V10zm2 0h6V7a3 3 0 0 0-6 0z" /></svg>iprefab.ai
              </span>
              <span className="w-[54px]" aria-hidden />
            </div>
            <div className="p-4 md:p-8">
              <p className="text-lg font-medium md:text-2xl">{h.greet}</p>
              <p className="mt-1 text-sm text-white/55">{h.greetLead}</p>
              <form
                className="mt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  go(text);
                }}
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  <Pill label={h.anyBuilder} value={builder} onChange={(v) => pick(builder, v, setBuilder)} options={[{ value: "", label: h.anyBuilder }, ...builders.map((b) => ({ value: b, label: b }))]} />
                  <Pill label={h.sizeChip} value={sizeLabel(size)} onChange={(v) => pick(sizeLabel(size), v, (x) => setSize(x.replace(" m²", "")))} options={[{ value: "", label: h.sizeChip }, ...sizes.map((s) => ({ value: `${s} m²`, label: `${s} m²` }))]} />
                  <Pill label={h.budgetChip} value={budgetLabel(budget)} onChange={(v) => { const opt = budgets.find((b) => budgetLabel(String(b)) === v); pick(budgetLabel(budget), v, () => setBudget(opt ? String(opt) : "")); }} options={[{ value: "", label: h.budgetChip }, ...budgets.map((b) => ({ value: budgetLabel(String(b)), label: budgetLabel(String(b)) }))]} />
                </div>
                <ul className="mb-3 flex flex-wrap gap-2">
                {h.suggestions.map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => toggle(s)} aria-pressed={has(s)} className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white ${has(s) ? "!border-[#aeb9ff]/60 !bg-[#4a5cf0]/40 !text-white" : ""}`}>
                      <Sparkle className="size-3 text-[#aeb9ff]" />{s}
                    </button>
                  </li>
                ))}
              </ul>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-3 transition-colors focus-within:border-white/30">
                  <label htmlFor="composer" className="sr-only">{h.composerLabel}</label>
                  <textarea
                    ref={taRef}
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
                    className="block w-full resize-none bg-transparent px-2 pt-1 text-base text-white outline-none placeholder:text-white/40"
                  />
                  <div className="mt-2 flex items-center gap-1">
                    <button type="button" className={iconBtn} aria-label={h.attach} title={h.attach}>
                      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7L14 4.5a3.3 3.3 0 0 1 4.7 4.7L10.2 17.7a1.7 1.7 0 0 1-2.4-2.4L15.5 7.6" /></svg>
                    </button>
                    <button type="button" className={iconBtn} aria-label={h.mic} title={h.mic}>
                      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></svg>
                    </button>
                    <button type="submit" aria-label={h.send} title={h.send} className="ml-auto grid size-10 place-items-center rounded-full bg-[#4a5cf0] text-white transition-colors hover:bg-[#5b6cf0]">
                      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Builders marquee framed by angled lines */}
      <section className="relative py-14">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none" stroke="white" strokeOpacity="0.14">
          <path d="M0 30H420L470 0M1440 30H1020L970 0M0 170H420L470 200M1440 170H1020L970 200" vectorEffect="non-scaling-stroke" />
          <path d="M470 0H970M470 200H970" vectorEffect="non-scaling-stroke" strokeOpacity="0.06" />
        </svg>
        <h2 className="relative px-4 text-center text-sm font-medium text-white/80 md:text-base">{h.marqueeTitle}</h2>
        <Marquee duration={45} className="relative mt-8">
          {wordmarks.map((w) => (
            <span key={w.name} className={`flex items-center gap-3 px-8 text-3xl whitespace-nowrap text-white/45 md:px-12 md:text-4xl ${w.className}`}>
              <Sparkle className="size-5 opacity-70" />{w.name}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="relative rounded-[40px] border border-white/15 px-4 pt-14 pb-6 md:px-12 md:pt-20 md:pb-12">
          <div className="text-center">
            <Badge>{h.introBadge}</Badge>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance md:text-5xl">{h.introTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/65">{h.introLead}</p>
          </div>
          <div className="glass relative mt-12 grid gap-4 rounded-3xl p-3 md:grid-cols-[1fr_1.2fr] md:p-4">
            <div className="flex flex-col gap-3 rounded-2xl bg-[#071438]/60 p-4">
              <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#4a5cf0] px-3.5 py-2 text-sm">{h.demoAsk}</p>
              <p className="max-w-[90%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm text-white/85">{h.demoReply}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2 text-xs text-white/70">
                {[h.features[0].t, "140 m²", t.cfg.pairs.extra.a].map((x) => <span key={x} className="rounded-full border border-white/10 px-3 py-1">{x}</span>)}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-b from-[#1b2b8f]/50 to-[#071438]/60 p-4">
              <MiniHouse className="mx-auto w-full max-w-sm" />
              <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3 text-sm">
                <span className="text-white/60">{h.mPrice}</span>
                <span className="text-xl font-semibold tabular-nums">€274.000</span>
              </div>
            </div>
          </div>
          <div className="relative mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { l: h.mPrice, v: "€274.000" },
              { l: h.mEnergy, v: "A" },
              { l: h.mDelivery, v: h.mDeliveryV },
            ].map((m) => (
              <div key={m.l} className="glass rounded-2xl px-5 py-4">
                <p className="text-xs text-white/60">{m.l}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <Badge>{h.stepsBadge}</Badge>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-balance md:text-5xl">{h.stepsTitle}</h2>
        <ol className="mt-12 grid gap-5 text-left md:grid-cols-3">
          {h.steps.map((s, i) => (
            <li key={s.t} className="glass flex flex-col rounded-3xl p-5">
              <div className="grid h-40 place-items-center rounded-2xl border border-white/10 bg-[#071438]/50 p-4">
                {i === 0 && (
                  <div className="w-full space-y-3">
                    <div className="flex justify-between text-xs text-white/60"><span>{t.cfg.plotSize}</span><span className="text-white">1 200 m²</span></div>
                    <div className="h-1.5 rounded-full bg-white/10"><div className="h-full w-1/2 rounded-full bg-[#5b6cf0]" /></div>
                    <div className="flex gap-1.5">{(["N", "E", "S", "W"] as const).map((o) => <span key={o} className={`rounded-full px-2.5 py-1 text-[11px] ${o === "S" ? "bg-white text-[#071438]" : "border border-white/15 text-white/70"}`}>{t.cfg.orient[o]}</span>)}</div>
                  </div>
                )}
                {i === 1 && (
                  <div className="flex w-full items-center gap-3">
                    <MiniHouse className="w-1/2" />
                    <div className="flex flex-1 flex-col gap-1.5 text-[11px]">
                      {[t.cfg.roofs.gable, t.cfg.pairs.facade.a, t.cfg.pairs.extra.a].map((x, j) => <span key={x} className={`rounded-full px-2.5 py-1 ${j === 0 ? "bg-[#4a5cf0]" : "border border-white/15 text-white/70"}`}>{x}</span>)}
                    </div>
                  </div>
                )}
                {i === 2 && (
                  <div className="w-full space-y-2">
                    {suggested.slice(0, 2).map((hs) => (
                      <div key={hs.slug} className="flex items-center justify-between rounded-xl bg-white/[0.06] px-3 py-2 text-xs"><span>{hs.builder}</span><span className="text-[#aeb9ff]">{hs.name}</span></div>
                    ))}
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#4a5cf0] py-1 pr-1 pl-3 text-xs">{h.stepBook}<ArrowCircle className="!size-5" /></span>
                  </div>
                )}
              </div>
              <span className="mt-5 text-xs font-medium text-[#aeb9ff]">0{i + 1}</span>
              <h3 className="mt-1 text-lg font-medium">{s.t}</h3>
              <p className="mt-1 text-sm text-white/60">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Suggested houses */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{h.suggestedTitle}</h2>
            <p className="mt-2 text-white/65">{h.suggestedLead}</p>
          </div>
          <Link href="/houses" className="glass inline-flex items-center gap-2 rounded-full py-1 pr-1 pl-4 text-sm hover:bg-white/10">{h.viewAll}<ArrowCircle className="!size-7" /></Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex snap-x gap-5 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
          {suggested.map((hs) => (
            <div key={hs.slug} className="flex snap-start">
              <HouseCard house={hs} size="sm" dark />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-24">
        <div className="glass grid gap-6 rounded-3xl p-6 md:grid-cols-2 md:items-end md:p-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{h.newsTitle}</h2>
            <p className="mt-2 max-w-sm text-white/65">{h.newsLead}</p>
          </div>
          <NewsletterForm dark />
        </div>
      </section>
    </div>
  );
}
