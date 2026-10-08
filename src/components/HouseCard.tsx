"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice, type House } from "@/data/houses";
import { HeartIcon } from "./Icons";

export default function HouseCard({ house, size = "md" }: { house: House; size?: "sm" | "md" }) {
  const [liked, setLiked] = useState(false);
  const sm = size === "sm";

  return (
    <article className={`group overflow-hidden rounded-2xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-shadow hover:shadow-lg ${sm ? "w-64 shrink-0" : ""}`}>
      <div className={`relative ${sm ? "h-40" : "aspect-[2/1]"}`}>
        <Image src={house.image} alt={house.name} fill sizes="(max-width: 768px) 100vw, 384px" className="object-cover" />
        <button
          onClick={() => setLiked(!liked)}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={liked}
          className="absolute top-3 right-3 rounded-full bg-black/10 p-1 backdrop-blur-[2px] transition-transform hover:scale-110"
        >
          <HeartIcon filled={liked} className="size-6" />
        </button>
      </div>
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`${sm ? "text-xl" : "text-2xl"} font-medium`}>{house.name}</h3>
          <p className={sm ? "text-base" : "text-xl"}>{formatPrice(house.price)}</p>
        </div>
        <p className="text-[11px] text-slate">{house.builder}</p>
        <div className="mt-4 flex gap-6 text-xs text-slate">
          <span>{house.size} m²</span>
          <span>{house.bedrooms} Bedrooms</span>
          <span>{house.floors} {house.floors === 1 ? "Floor" : "Floors"}</span>
        </div>
      </div>
    </article>
  );
}
