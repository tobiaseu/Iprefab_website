"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { src: "/images/house-cover.jpg", caption: "Aava 134 · Finnlamelli" },
  { src: "/images/hero.png", caption: "Holiday house · Lakeland" },
];

export default function HeroSlideshow() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((s, n) => (
        <div
          key={s.src}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${n === i ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            key={n === i ? `${s.src}-on` : s.src}
            src={s.src}
            alt=""
            fill
            priority={n === 0}
            sizes="100vw"
            className={`object-cover ${n === i ? "kenburns" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/40 to-navy/10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy/50 to-transparent" />
      <div className="absolute right-6 bottom-6 hidden items-center gap-3 text-xs text-white/80 md:flex">
        <span>{slides[i].caption}</span>
        <div className="flex gap-1.5">
          {slides.map((s, n) => (
            <button
              key={s.src}
              onClick={() => setI(n)}
              aria-label={`Show photo ${n + 1}`}
              className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
