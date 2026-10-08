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
    <div className="w-full max-w-[544px] rounded-[32px] bg-mist p-4 shadow-lg">
      <h2 className="py-2 text-center text-2xl font-medium">Choose Your House Type</h2>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-4">
        {houseTypes.map(({ value, label }) => {
          const Icon = icons[value];
          const active = selected === value;
          return (
            <button
              key={value}
              onClick={() => setSelected(value)}
              aria-pressed={active}
              className={`flex h-32 flex-col items-center justify-center gap-3 rounded-2xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition ${active ? "ring-2 ring-periwinkle" : "hover:-translate-y-0.5"}`}
            >
              <Icon className="h-12 w-16" />
              <span className="text-sm sm:text-base">{label}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => router.push(selected ? `/houses?type=${selected}` : "/houses")}
        className="mt-4 h-12 w-full rounded-[20px] bg-periwinkle text-xl font-medium text-white hover:brightness-95"
      >
        Continue
      </button>
    </div>
  );
}
