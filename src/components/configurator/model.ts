import { houses, type House } from "@/data/houses";

export type Orientation = "N" | "E" | "S" | "W";
export type Roof = "gable" | "shed" | "flat";
export type WindowSize = "regular" | "large";

export type Config = {
  plotSize: number;
  orientation: Orientation;
  people: number;
  wfh: boolean;
  extra: "sauna" | "study";
  kitchen: "open" | "closed";
  floors: 1 | 2;
  facade: "wood" | "plaster";
  budget: number;
  roof: Roof;
  windows: WindowSize;
  reference?: string;
};

export const initialConfig: Config = {
  plotSize: 1200,
  orientation: "S",
  people: 3,
  wfh: false,
  extra: "sauna",
  kitchen: "open",
  floors: 1,
  facade: "wood",
  budget: 280000,
  roof: "gable",
  windows: "regular",
};

/** Floor area the household needs, in m². */
export function targetArea(c: Config) {
  const a = 45 + c.people * 24 + (c.wfh ? 12 : 0) + (c.extra === "study" ? 10 : 7) + (c.kitchen === "closed" ? 6 : 0);
  return Math.round(Math.min(200, Math.max(70, a)));
}

export function estimatePrice(c: Config) {
  const area = targetArea(c);
  let p = area * 1850;
  if (c.floors === 2) p -= area * 90; // a smaller footprint means less foundation and roof
  if (c.extra === "sauna") p += 14000;
  if (c.facade === "wood") p += 9000;
  if (c.kitchen === "closed") p += 3000;
  if (c.windows === "large") p += 11000;
  if (c.roof === "flat") p += 7000;
  if (c.roof === "shed") p += 3000;
  return Math.round(p / 1000) * 1000;
}

export type Match = { house: House; reasons: ReasonKey[] };
export type ReasonKey =
  | { k: "floors"; n: number }
  | { k: "size"; s: number; t: number }
  | { k: "budget" }
  | { k: "overBudget"; by: number }
  | { k: "bedrooms"; n: number }
  | { k: "holiday" };

export function findMatches(c: Config): Match[] {
  const area = targetArea(c);
  const score = (h: House) =>
    Math.abs(h.size - area) / area +
    (h.floors === c.floors ? 0 : 0.4) +
    Math.max(0, h.price - c.budget) / c.budget * 2 +
    (c.extra === "sauna" && h.type === "holiday" ? -0.08 : 0);
  const ranked = [...houses].sort((a, b) => score(a) - score(b));

  // Prefer one model per builder; fill up from the next best if there are fewer builders than slots.
  const picked: House[] = [];
  const seen = new Set<string>();
  for (const h of ranked) if (!seen.has(h.builder) && picked.length < 3) { picked.push(h); seen.add(h.builder); }
  for (const h of ranked) if (picked.length < 3 && !picked.includes(h)) picked.push(h);

  return picked.map((h) => {
    const reasons: ReasonKey[] = [];
    if (h.floors === c.floors) reasons.push({ k: "floors", n: h.floors });
    if (Math.abs(h.size - area) <= 25) reasons.push({ k: "size", s: h.size, t: area });
    reasons.push(h.price <= c.budget ? { k: "budget" } : { k: "overBudget", by: h.price - c.budget });
    if (c.extra === "study" && h.bedrooms >= c.people) reasons.push({ k: "bedrooms", n: h.bedrooms });
    if (c.extra === "sauna" && h.type === "holiday") reasons.push({ k: "holiday" });
    return { house: h, reasons: reasons.slice(0, 3) };
  });
}

/** Prefill a config from a free-text request (English or Finnish) by simple keyword matching. */
export function parsePrompt(q: string): Config {
  const s = q.toLowerCase().replace(/ /g, " ");
  const c: Config = { ...initialConfig };
  if (/sauna/.test(s)) c.extra = "sauna";
  if (/office|study|työhuone|toimisto|etätyö/.test(s)) { c.extra = /sauna/.test(s) ? "sauna" : "study"; c.wfh = true; }
  if (/two[- ]?(floor|stor)|2[- ]?(floor|stor)|kaksikerroksi|kaksi kerrosta|2 kerros/.test(s)) c.floors = 2;
  else if (/one[- ]?(floor|stor)|single[- ]?(floor|stor)|yksikerroksi|yhdessä kerroksessa/.test(s)) c.floors = 1;
  if (/plaster|render|rapat|kivitalo/.test(s)) c.facade = "plaster";
  else if (/wood|timber|log|puu|hirsi/.test(s)) c.facade = "wood";
  if (/open kitchen|avokeittiö/.test(s)) c.kitchen = "open";
  else if (/separate kitchen|erillinen keittiö/.test(s)) c.kitchen = "closed";

  const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, yhdelle: 1, kahdelle: 2, kolmelle: 3, neljälle: 4, viidelle: 5, kuudelle: 6, kaksihenkiselle: 2, kolmihenkiselle: 3, nelihenkiselle: 4, viisihenkiselle: 5, kuusihenkiselle: 6 };
  const num = (w: string) => (/^\d$/.test(w) ? +w : words[w]);
  const p =
    s.match(/(?:for|family of|for a family of)\s+(\d|one|two|three|four|five|six)\b(?!\s*(?:m²|m2|floor|stor))/) ??
    s.match(/(\d)\s*(?:people|persons|-?henkiselle|hengelle|hengen)/) ??
    s.match(/\b(yhdelle|kahdelle|kolmelle|neljälle|viidelle|kuudelle|\w+henkiselle)\b/);
  const pn = p ? num(p[1]) : undefined;
  if (pn) c.people = Math.min(6, Math.max(1, pn));
  else {
    const m2 = s.match(/(\d{2,3})\s*(?:m²|m2|neliö|sqm)/);
    if (m2) c.people = Math.min(6, Math.max(1, Math.round((+m2[1] - 60) / 24)));
  }

  const money = s.match(/(?:€\s*(\d[\d\s,.]*)\s*(k|000)?|(\d[\d\s,.]*)\s*(k|000)?\s*(?:€|eur))/);
  if (money) {
    const raw = (money[1] ?? money[3]).replace(/[\s,.]/g, "");
    let v = +raw;
    if (money[2] || money[4] || v < 1000) v = v < 1000 ? v * 1000 : v;
    if (v >= 50000) c.budget = Math.min(450000, Math.max(150000, Math.round(v / 5000) * 5000));
  }
  return c;
}
