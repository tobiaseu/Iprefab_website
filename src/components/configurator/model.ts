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
