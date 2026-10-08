"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice } from "@/data/houses";
import { useLang } from "@/i18n/LanguageProvider";
import type { Dict } from "@/i18n/en";
import HouseDrawing from "./HouseDrawing";
import PairIcon from "./PairIcon";
import ResultActions from "./ResultActions";
import { estimatePrice, findMatches, initialConfig, parsePrompt, targetArea, type Config, type Orientation, type ReasonKey } from "./model";

const STEPS = ["plot", "household", "lifestyle", "budget", "matches", "tweaks", "result"] as const;
type Step = (typeof STEPS)[number];

function question(t: Dict, s: Step) {
  return { plot: t.cfg.plotQ, household: t.cfg.householdQ, lifestyle: t.cfg.lifestyleQ, budget: t.cfg.budgetQ, matches: t.cfg.matchesQ, tweaks: t.cfg.tweaksQ, result: t.cfg.resultQ }[s];
}

function answer(t: Dict, s: Step, c: Config, matchName?: string) {
  const p = t.cfg.pairs;
  switch (s) {
    case "plot": return t.cfg.plotA(c.plotSize, t.cfg.orient[c.orientation]);
    case "household": return t.cfg.householdA(c.people, c.wfh);
    case "lifestyle":
      return [c.extra === "sauna" ? p.extra.a : p.extra.b, c.kitchen === "open" ? p.kitchen.a : p.kitchen.b, c.floors === 1 ? p.floors.a : p.floors.b, c.facade === "wood" ? p.facade.a : p.facade.b].join(", ");
    case "budget": return t.cfg.budgetA(formatPrice(c.budget));
    case "matches": return matchName ?? "";
    case "tweaks": return t.cfg.tweaksA(t.cfg.roofs[c.roof], t.cfg.windowSizes[c.windows]);
    default: return "";
  }
}

function reasonText(t: Dict, r: ReasonKey) {
  const R = t.cfg.reasons;
  switch (r.k) {
    case "floors": return R.floors(r.n);
    case "size": return R.size(r.s, r.t);
    case "budget": return R.budget;
    case "overBudget": return R.overBudget(formatPrice(r.by));
    case "bedrooms": return R.bedrooms(r.n);
    case "holiday": return R.holiday;
  }
}

function Segmented<T extends string | number>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`border px-4 py-2 text-sm transition-colors ${value === o.value ? "border-navy bg-navy text-paper" : "border-navy/20 hover:border-navy/60"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Configurator({ q = "" }: { q?: string }) {
  const { t } = useLang();
  const start = useMemo(() => (q ? parsePrompt(q) : initialConfig), [q]);
  const [c, setC] = useState<Config>(start);
  const [step, setStep] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof Config>(k: K, v: Config[K]) => setC((p) => ({ ...p, [k]: v }));

  const matches = useMemo(() => findMatches(c), [c]);
  const price = estimatePrice(c);
  const current = STEPS[step];
  const refName = matches.find((m) => m.house.slug === c.reference)?.house;

  useEffect(() => {
    // Scroll only the conversation pane, never the window.
    const el = listRef.current;
    if (step > 0 && el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [step]);

  const pairs = [
    { key: "extra", a: "sauna", b: "study", ia: "sauna", ib: "study" },
    { key: "kitchen", a: "open", b: "closed", ia: "open", ib: "closed" },
    { key: "floors", a: 1, b: 2, ia: "one", ib: "two" },
    { key: "facade", a: "wood", b: "plaster", ia: "wood", ib: "plaster" },
  ] as const;

  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 px-4 md:px-8 lg:h-[calc(100svh-4rem)]">
      {/* Conversation */}
      <section className="order-2 col-span-12 flex min-h-0 flex-col py-8 lg:order-1 lg:col-span-5 lg:py-10" aria-live="polite">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">{t.cfg.title}</h1>
          {step > 0 && (
            <button type="button" onClick={() => { setStep(0); setC(start); }} className="text-sm text-slate underline underline-offset-4 hover:text-navy">
              {t.cfg.restart}
            </button>
          )}
        </div>

        <div ref={listRef} className="no-scrollbar mt-8 min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
          <GuideLine name={t.cfg.guide}>{t.cfg.intro}</GuideLine>
          {q && (
            <div className="space-y-3">
              <p className="ml-auto w-fit max-w-[85%] bg-stone px-4 py-2.5 text-sm">{q}</p>
              <GuideLine name={t.cfg.guide}>{t.cfg.prefilled}</GuideLine>
            </div>
          )}
          {STEPS.slice(0, step).map((s) => (
            <div key={s} className="space-y-3">
              <GuideLine name={t.cfg.guide}>{question(t, s)}</GuideLine>
              <p className="ml-auto w-fit max-w-[85%] bg-stone px-4 py-2.5 text-sm">{answer(t, s, c, refName?.name ?? matches[0].house.name)}</p>
            </div>
          ))}

          <div className="space-y-5">
            <GuideLine name={t.cfg.guide} current>{question(t, current)}</GuideLine>

            {current === "plot" && (
              <div className="space-y-6">
                <label className="block">
                  <span className="flex justify-between text-sm text-slate">{t.cfg.plotSize}<span className="text-navy">{c.plotSize} m²</span></span>
                  <input type="range" min={400} max={3000} step={50} value={c.plotSize} onChange={(e) => set("plotSize", +e.target.value)} className="mt-2 w-full accent-periwinkle" />
                </label>
                <div>
                  <p className="mb-2 text-sm text-slate">{t.cfg.orientation}</p>
                  <Segmented<Orientation> label={t.cfg.orientation} value={c.orientation} onChange={(v) => set("orientation", v)}
                    options={(["N", "E", "S", "W"] as const).map((o) => ({ value: o, label: t.cfg.orient[o] }))} />
                </div>
              </div>
            )}

            {current === "household" && (
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-sm text-slate">{t.cfg.people}</p>
                  <Segmented<number> label={t.cfg.people} value={c.people} onChange={(v) => set("people", v)}
                    options={[1, 2, 3, 4, 5, 6].map((n) => ({ value: n, label: n === 6 ? "6+" : String(n) }))} />
                </div>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={c.wfh} onChange={(e) => set("wfh", e.target.checked)} className="size-4 accent-periwinkle" />
                  {t.cfg.wfh}
                </label>
              </div>
            )}

            {current === "lifestyle" && (
              <div className="space-y-5">
                {pairs.map((p) => {
                  const labels = t.cfg.pairs[p.key];
                  return (
                    <fieldset key={p.key}>
                      <legend className="mb-2 text-sm text-slate">{labels.q}</legend>
                      <div className="grid grid-cols-2 gap-2">
                        {([[p.a, labels.a, p.ia], [p.b, labels.b, p.ib]] as const).map(([v, label, icon]) => {
                          const on = c[p.key] === v;
                          return (
                            <button key={String(v)} type="button" aria-pressed={on}
                              onClick={() => setC((prev) => ({ ...prev, [p.key]: v }))}
                              className={`flex items-center gap-3 border p-3 text-left text-sm transition-colors ${on ? "border-navy bg-navy text-paper" : "border-navy/15 bg-stone/50 hover:border-navy/50"}`}>
                              <PairIcon name={icon} />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            )}

            {current === "budget" && (
              <label className="block">
                <span className="flex justify-between text-sm text-slate">{t.cfg.budget}<span className="text-navy">{formatPrice(c.budget)}</span></span>
                <input type="range" min={150000} max={450000} step={5000} value={c.budget} onChange={(e) => set("budget", +e.target.value)} className="mt-2 w-full accent-periwinkle" />
                <span className="mt-1 flex justify-between text-xs text-slate"><span>{formatPrice(150000)}</span><span>{formatPrice(450000)}</span></span>
              </label>
            )}

            {current === "matches" && (
              <ul className="space-y-4">
                {matches.map((m) => {
                  const on = (c.reference ?? matches[0].house.slug) === m.house.slug;
                  return (
                    <li key={m.house.slug}>
                      <button type="button" aria-pressed={on} onClick={() => set("reference", m.house.slug)}
                        className={`grid w-full grid-cols-[96px_1fr] gap-4 border p-3 text-left transition-colors ${on ? "border-navy" : "border-navy/15 hover:border-navy/50"}`}>
                        <span className="relative aspect-[4/3] overflow-hidden bg-stone">
                          <Image src={m.house.image} alt="" fill sizes="96px" className="object-cover" />
                        </span>
                        <span>
                          <span className="flex flex-wrap justify-between gap-x-3">
                            <span className="font-medium">{m.house.name}</span>
                            <span className="text-sm text-slate">{formatPrice(m.house.price)}</span>
                          </span>
                          <span className="block text-sm text-slate">{m.house.builder}, {m.house.size} m²</span>
                          <span className="mt-1.5 block text-sm text-moss first-letter:uppercase">{m.reasons.map((r) => reasonText(t, r)).join(", ")}.</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {current === "tweaks" && (
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-sm text-slate">{t.cfg.roof}</p>
                  <Segmented label={t.cfg.roof} value={c.roof} onChange={(v) => set("roof", v)}
                    options={(["gable", "shed", "flat"] as const).map((r) => ({ value: r, label: t.cfg.roofs[r] }))} />
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate">{t.cfg.windows}</p>
                  <Segmented label={t.cfg.windows} value={c.windows} onChange={(v) => set("windows", v)}
                    options={(["regular", "large"] as const).map((w) => ({ value: w, label: t.cfg.windowSizes[w] }))} />
                </div>
              </div>
            )}

            {current === "result" && (
              <div className="space-y-8">
                <dl className="grid grid-cols-2 gap-4 border-y border-navy/10 py-4 text-sm">
                  <div><dt className="text-slate">{t.cfg.sizeLabel}</dt><dd className="mt-0.5 font-medium">{targetArea(c)} m²</dd></div>
                  <div><dt className="text-slate">{t.cfg.reference}</dt><dd className="mt-0.5 font-medium">{(refName ?? matches[0].house).name}, {(refName ?? matches[0].house).builder}</dd></div>
                </dl>
                <ResultActions svgRef={svgRef} />
              </div>
            )}

            {current !== "result" && (
              <div className="flex items-center gap-6 pt-2">
                <button type="button" onClick={() => {
                  if (current === "matches" && !c.reference) set("reference", matches[0].house.slug);
                  setStep(step + 1);
                }} className="bg-navy px-6 py-3 font-medium text-paper transition-colors hover:bg-periwinkle">
                  {t.cfg.next}
                </button>
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="text-sm text-slate underline underline-offset-4 hover:text-navy">
                    {t.cfg.back}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* House */}
      <section className="order-1 col-span-12 pt-6 lg:order-2 lg:col-span-7 lg:flex lg:flex-col lg:justify-center lg:py-10">
        <div className="bg-stone">
          <HouseDrawing ref={svgRef} config={c} title={t.cfg.houseAlt} />
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-navy/10 py-4">
          <p className="text-sm text-slate">{t.cfg.estimate}<span className="block text-xs">{t.cfg.estimateNote}</span></p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{formatPrice(price)}</p>
        </div>
      </section>
    </div>
  );
}

function GuideLine({ name, children, current }: { name: string; children: React.ReactNode; current?: boolean }) {
  return (
    <div className="flex gap-3">
      <span aria-hidden="true" className={`mt-1.5 size-2.5 shrink-0 rounded-full ${current ? "bg-periwinkle" : "bg-navy/25"}`} />
      <p className={current ? "text-lg leading-snug" : "text-navy/70"}>
        <span className="sr-only">{name}: </span>
        {children}
      </p>
    </div>
  );
}
