"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import HouseCard from "@/components/HouseCard";
import { SortIcon } from "@/components/Icons";
import { houses, houseTypes, type HouseType } from "@/data/houses";

type Filters = { type: "" | HouseType; size: string; price: string; rooms: string; floors: string };

const sizeRanges: Record<string, [number, number]> = { "<100": [0, 99], "100-130": [100, 130], ">130": [131, 999] };
const priceRanges: Record<string, [number, number]> = { "<200k": [0, 199999], "200-300k": [200000, 300000], ">300k": [300001, 9e9] };
const sorts = {
  relevance: { label: "Relevance", fn: () => 0 },
  priceAsc: { label: "Price: low to high", fn: (a: (typeof houses)[0], b: (typeof houses)[0]) => a.price - b.price },
  priceDesc: { label: "Price: high to low", fn: (a: (typeof houses)[0], b: (typeof houses)[0]) => b.price - a.price },
  size: { label: "Size", fn: (a: (typeof houses)[0], b: (typeof houses)[0]) => b.size - a.size },
};

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="flex flex-col rounded-xl border border-slate/60 bg-white px-4 py-2 text-sm">
      <span className="font-medium">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-xs text-slate outline-none">
        <option value="">Select {label}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}

export default function HouseSearch() {
  const params = useSearchParams();
  const initialType = (params.get("type") ?? "") as Filters["type"];
  const [draft, setDraft] = useState<Filters>({ type: initialType, size: "", price: "", rooms: "", floors: "" });
  const [filters, setFilters] = useState<Filters>(draft);
  const [sort, setSort] = useState<keyof typeof sorts>("relevance");
  const [sortOpen, setSortOpen] = useState(false);

  const results = useMemo(() => {
    return houses
      .filter((h) => {
        if (filters.type && h.type !== filters.type) return false;
        if (filters.size) { const [a, b] = sizeRanges[filters.size]; if (h.size < a || h.size > b) return false; }
        if (filters.price) { const [a, b] = priceRanges[filters.price]; if (h.price < a || h.price > b) return false; }
        if (filters.rooms && h.bedrooms < Number(filters.rooms)) return false;
        if (filters.floors && h.floors !== Number(filters.floors)) return false;
        return true;
      })
      .sort(sorts[sort].fn);
  }, [filters, sort]);

  const set = (k: keyof Filters) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <>
      <section className="relative bg-[url(/images/hero.png)] bg-cover bg-center">
        <div className="mx-auto flex max-w-[1440px] justify-center px-4 py-8">
          <form
            onSubmit={(e) => { e.preventDefault(); setFilters(draft); }}
            className="w-full max-w-[768px] rounded-[32px] bg-white p-6 shadow-lg"
          >
            <h1 className="text-center text-2xl font-medium">Your Project Starts Here</h1>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              <Select label="House Type" value={draft.type} onChange={set("type")} options={houseTypes.map((t) => [t.value, t.label])} />
              <Select label="Size Range" value={draft.size} onChange={set("size")} options={[["<100", "Under 100 m²"], ["100-130", "100–130 m²"], [">130", "Over 130 m²"]]} />
              <Select label="Price Range" value={draft.price} onChange={set("price")} options={[["<200k", "Under €200.000"], ["200-300k", "€200.000–300.000"], [">300k", "Over €300.000"]]} />
              <Select label="Rooms" value={draft.rooms} onChange={set("rooms")} options={[["2", "2+ bedrooms"], ["3", "3+ bedrooms"], ["4", "4+ bedrooms"], ["5", "5+ bedrooms"]]} />
              <Select label="Floors" value={draft.floors} onChange={set("floors")} options={[["1", "1 floor"], ["2", "2 floors"]]} />
              <button className="col-span-2 min-h-14 rounded-[20px] bg-periwinkle text-xl font-medium text-white hover:brightness-95 md:col-span-1">
                Search Houses
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="bg-white">
        <div className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-32">
          <p className="text-sm text-slate">{results.length} houses found</p>
          <button onClick={() => setSortOpen(!sortOpen)} aria-label="Sort" aria-expanded={sortOpen} className="rounded-lg p-1 hover:bg-mist">
            <SortIcon className="size-6" />
          </button>
          {sortOpen && (
            <div className="absolute top-14 right-4 z-10 w-56 overflow-hidden rounded-2xl bg-white shadow-xl md:right-32">
              {(Object.keys(sorts) as (keyof typeof sorts)[]).map((k) => (
                <button
                  key={k}
                  onClick={() => { setSort(k); setSortOpen(false); }}
                  className={`block w-full px-4 py-3 text-left text-sm hover:bg-mist ${sort === k ? "font-semibold" : ""}`}
                >
                  {sorts[k].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-4 py-8 pb-24 md:px-32">
        {results.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((h) => <HouseCard key={h.slug} house={h} />)}
          </div>
        ) : (
          <p className="py-20 text-center text-slate">No houses match these filters. Try widening your search.</p>
        )}
      </section>
    </>
  );
}
