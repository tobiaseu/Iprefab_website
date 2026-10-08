"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, type House } from "@/data/houses";
import { useLang } from "@/i18n/LanguageProvider";
import { HeartIcon } from "./Icons";

export default function HouseCard({ house, size = "md", dark = false }: { house: House; size?: "sm" | "md"; dark?: boolean }) {
  const { t } = useLang();
  const [liked, setLiked] = useState(false);
  const sm = size === "sm";
  const pill = dark ? "bg-white/10" : "bg-white/10";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl ${dark ? "glass text-white hover:bg-white/10" : "glass hover:bg-white/10"} transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(7,20,56,0.35)] ${sm ? "w-80 shrink-0" : ""}`}
    >
      <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-[18px]">
        <Image
          src={house.image}
          alt={house.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 text-[#071438] px-3 py-1 text-[11px] font-medium backdrop-blur">
          {house.builder}
        </span>
        <button
          onClick={() => setLiked(!liked)}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={liked}
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-black/25 backdrop-blur transition hover:scale-110 hover:bg-black/40"
        >
          <HeartIcon filled={liked} className="size-5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col px-5 pt-3 pb-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">
            <Link href={`/houses/${house.slug}`} className="after:absolute after:inset-0">
              {house.name}
            </Link>
          </h3>
          <p className={`shrink-0 text-lg font-medium text-[#aeb9ff]`}>{formatPrice(house.price)}</p>
        </div>
        <ul className={`mt-4 flex flex-wrap gap-2 text-xs ${dark ? "text-white/75" : "text-slate"}`}>
          <li className={`rounded-full ${pill} px-3 py-1`}>{house.size} m²</li>
          <li className={`rounded-full ${pill} px-3 py-1`}>{t.home.bedrooms(house.bedrooms)}</li>
          <li className={`rounded-full ${pill} px-3 py-1`}>{t.home.floors(house.floors)}</li>
        </ul>
      </div>
    </article>
  );
}
