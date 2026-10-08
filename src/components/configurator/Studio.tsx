"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice, houses } from "@/data/houses";
import { useLang } from "@/i18n/LanguageProvider";
import { AREAS, COLORS, EXTRAS, initialStudio, parseStudio, studioPrice, type ColorKey, type Extra, type Roof, type Studio as S } from "./model";
import { useComposer, useTypewriter } from "./useComposer";
import { Pill, Sparkle } from "./ComposerBits";

const Wireframe = dynamic(() => import("./Wireframe"), { ssr: false });

const builders = [...new Set(houses.map((h) => h.builder))];
const budgets = [200000, 250000, 300000, 400000];

const pill = (on: boolean) =>
  `rounded-full px-3 py-1 text-[13px] whitespace-nowrap transition-colors ${on ? "bg-white text-[#071438]" : "border border-white/12 bg-white/[0.04] text-white/75 hover:border-white/30 hover:text-white"}`;

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex min-w-0 flex-col gap-2">
      <span className="text-[11px] text-white/45">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

async function downloadCanvas(canvas: HTMLCanvasElement) {
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, out.height);
  g.addColorStop(0, "#071438");
  g.addColorStop(1, "#0b1a4a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  const png = await new Promise<Blob | null>((r) => out.toBlob(r, "image/png"));
  if (!png) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(png);
  a.download = "iprefab-house.png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function Studio({ q = "" }: { q?: string }) {
  const { t, lang } = useLang();
  const st = t.studio;
  const [s, setS] = useState<S>(() => (q ? parseStudio(q, initialStudio) : initialStudio));
  const { text, setText, ref: promptRef, has, toggle, pick } = useComposer(q);
  const placeholder = useTypewriter(st.placeholders);
  const [builder, setBuilder] = useState("");
  const [budget, setBudget] = useState("");
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  // Typing or chips reshape the model, but only for what the text mentions.
  const lastText = useRef(q);
  useEffect(() => {
    if (text === lastText.current) return;
    lastText.current = text;
    const id = window.setTimeout(() => setS((prev) => parseStudio(text, prev)), 250);
    return () => window.clearTimeout(id);
  }, [text]);

  const set = <K extends keyof S>(k: K, v: S[K]) => setS((p) => ({ ...p, [k]: v }));
  const toggleExtra = (e: Extra) => setS((p) => ({ ...p, extras: p.extras.includes(e) ? p.extras.filter((x) => x !== e) : [...p.extras, e] }));
  const price = studioPrice(s);
  const fmt = (n: number) => new Intl.NumberFormat(lang === "fi" ? "fi-FI" : "en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const budgetLabel = (v: string) => (v ? `${st.under} ${fmt(+v)}` : "");
  const studio = useMemo(() => s, [s]);
  const classicHref = `/configure/classic${text.trim() ? `?q=${encodeURIComponent(text.trim())}` : ""}`;

  return (
    <div className="studio-bg relative -mt-16 text-white md:-mt-20">
      {/* Stage */}
      <section className="relative h-[62svh] min-h-[440px] overflow-hidden lg:h-[100svh] lg:min-h-[720px]" aria-labelledby="studio-title">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(120,150,255,0.14),transparent_60%)]" />
        <Wireframe studio={studio} lift={wide ? 0.24 : 0} onCanvas={(c) => (canvas.current = c)} label={st.modelAlt} />

        <div className="pointer-events-none absolute inset-x-0 top-20 flex flex-col items-center gap-3 px-4 md:top-24">
          <h1 id="studio-title" className="sr-only">{st.title}</h1>
          <ol aria-label={st.phaseLabel} className="pointer-events-auto flex w-full max-w-xl items-end gap-1.5">
            {st.phases.map((p, i) => (
              <li key={p} aria-current={i === 0 ? "step" : undefined} className="flex flex-1 flex-col gap-1.5">
                <span className={`hidden text-[11px] sm:block ${i === 0 ? "text-white" : "text-white/40"}`}>{p}</span>
                <span className={`h-[3px] rounded-full ${i === 0 ? "bg-white" : "bg-white/15"}`} />
              </li>
            ))}
          </ol>
          <p className="text-xs text-white/55 sm:hidden">{st.phaseOf(st.phases[0])}</p>
        </div>

        <div className="absolute top-20 right-4 hidden md:top-24 md:right-8 md:block">
          <PriceChip label={t.cfg.estimate} note={t.cfg.estimateNote} value={formatPrice(price)} />
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 md:hidden">
          <PriceChip label={t.cfg.estimate} note="" value={formatPrice(price)} />
        </div>
        <p className="pointer-events-none absolute bottom-4 left-4 hidden text-xs text-white/40 lg:left-8 lg:block">{st.drag}</p>
      </section>

      {/* Dock */}
      <section aria-label={st.dockLabel} className="relative z-10 px-4 pb-10 lg:absolute lg:inset-x-0 lg:bottom-6 lg:pb-0">
        <div className="glass mx-auto w-full max-w-[880px] rounded-[28px] !bg-[#0a1640]/70 p-3 md:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setS((prev) => parseStudio(text, prev));
            }}
            className="flex items-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.05] py-1.5 pr-1.5 pl-4 transition-colors focus-within:border-white/35"
          >
            <Sparkle className="size-4 shrink-0 text-[#c9d1ff]" />
            <label htmlFor="studio-prompt" className="sr-only">{st.promptLabel}</label>
            <input
              ref={promptRef as React.RefObject<HTMLInputElement>}
              id="studio-prompt"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2 text-base text-white outline-none placeholder:text-white/40"
            />
            <button type="submit" aria-label={st.apply} title={st.apply} className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#071438] transition-colors hover:bg-[#dfe4ff]">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 19V5M6 11l6-6 6 6" /></svg>
            </button>
          </form>

          <div className="no-scrollbar -mx-3 mt-2.5 flex gap-2 overflow-x-auto px-3 md:-mx-4 md:px-4">
            <Pill label={st.anyBuilder} value={builder} onChange={(v) => { pick(builder, v); setBuilder(v); }} options={[{ value: "", label: st.anyBuilder }, ...builders.map((b) => ({ value: b, label: b }))]} />
            <Pill label={st.anyBudget} value={budgetLabel(budget)} onChange={(v) => { const o = budgets.find((b) => budgetLabel(String(b)) === v); pick(budgetLabel(budget), v); setBudget(o ? String(o) : ""); }} options={[{ value: "", label: st.anyBudget }, ...budgets.map((b) => ({ value: budgetLabel(String(b)), label: budgetLabel(String(b)) }))]} />
            {st.suggestions.map((x) => (
              <button key={x} type="button" onClick={() => toggle(x)} aria-pressed={has(x)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${has(x) ? "border-[#aeb9ff]/60 bg-[#4a5cf0]/40 text-white" : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/30 hover:text-white"}`}>
                <Sparkle className="size-3 text-[#aeb9ff]" />{x}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-3 border-t border-white/10 pt-3">
            <Group label={st.size}>
              {AREAS.map((a) => <button key={a} type="button" aria-pressed={s.area === a} onClick={() => set("area", a)} className={pill(s.area === a)}>{a} m²</button>)}
            </Group>
            <Group label={st.floors}>
              {([1, 2] as const).map((f) => <button key={f} type="button" aria-pressed={s.floors === f} onClick={() => set("floors", f)} className={pill(s.floors === f)}>{f === 1 ? t.cfg.pairs.floors.a : t.cfg.pairs.floors.b}</button>)}
            </Group>
            <Group label={t.cfg.roof}>
              {(["gable", "shed", "flat"] as Roof[]).map((r) => <button key={r} type="button" aria-pressed={s.roof === r} onClick={() => set("roof", r)} className={pill(s.roof === r)}>{t.cfg.roofs[r]}</button>)}
            </Group>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
            <Group label={st.color}>
              {(Object.keys(COLORS) as ColorKey[]).map((k) => (
                <button key={k} type="button" aria-pressed={s.color === k} aria-label={st.colors[k]} title={st.colors[k]} onClick={() => set("color", k)}
                  className={`grid size-7 place-items-center rounded-full border transition ${s.color === k ? "border-white" : "border-white/15 hover:border-white/40"}`}>
                  <span className="size-4 rounded-full" style={{ background: COLORS[k] }} />
                </button>
              ))}
            </Group>
            <Group label={st.extras}>
              {EXTRAS.map((e) => <button key={e} type="button" aria-pressed={s.extras.includes(e)} onClick={() => toggleExtra(e)} className={pill(s.extras.includes(e))}>{st.extraNames[e]}</button>)}
            </Group>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-3">
            <button type="button" onClick={() => canvas.current && downloadCanvas(canvas.current)} className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">{st.download}</button>
            <Link href={classicHref} className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">{st.classic}</Link>
            <Link href={classicHref} className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#4a5cf0] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-[#5b6cf0]">
              {st.next}
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PriceChip({ label, note, value }: { label: string; note: string; value: string }) {
  return (
    <div className="glass rounded-2xl px-4 py-2.5 text-right" aria-live="polite">
      <p className="text-[11px] text-white/55">{label}</p>
      <p className="text-xl font-semibold tracking-tight tabular-nums md:text-2xl">{value}</p>
      {note && <p className="text-[10px] text-white/40">{note}</p>}
    </div>
  );
}
