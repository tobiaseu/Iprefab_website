"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { houseTypes, type HouseType } from "@/data/houses";
import { CabinIcon, DetachedIcon, HolidayIcon } from "./Icons";

const icons = { detached: DetachedIcon, holiday: HolidayIcon, cabin: CabinIcon };

export default function HouseTypePicker() {
  const router = useRouter();
  const [selected, setSelected] = useState<HouseType | null>(null);

  return (
    <div className="w-full max-w-[520px] glass rounded-[28px] p-5 shadow-2xl md:p-6">
      <h2 className="text-lg font-semibold tracking-tight">What are you looking for?</h2>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-4">
        {houseTypes.map(({ value, label }) => {
          const Icon = icons[value];
          const active = selected === value;
          return (
            <button
              key={value}
              onClick={() => setSelected(value)}
              aria-pressed={active}
              className={`flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border bg-white/5 transition ${active ? "border-periwinkle bg-periwinkle/5 ring-2 ring-periwinkle/30" : "border-navy/10 hover:-translate-y-0.5 hover:border-navy/30"}`}
            >
              <Icon className="h-12 w-16" />
              <span className="text-xs font-medium sm:text-sm">{label}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => router.push(selected ? `/houses?type=${selected}` : "/houses")}
        className="mt-4 h-12 w-full rounded-full bg-[#4a5cf0] text-base font-medium text-white transition hover:bg-[#5b6cf0]"
      >
        Find my house →
      </button>
    </div>
  );
}
