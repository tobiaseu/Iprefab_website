"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, houses } from "@/data/houses";
import { useLang } from "@/i18n/LanguageProvider";
import NewsletterForm from "./NewsletterForm";

const wordmarks = [
  { name: "Finnlamelli", className: "font-semibold tracking-tight" },
  { name: "Designtalo", className: "font-light tracking-wide" },
  { name: "Honka", className: "font-bold tracking-[0.12em]" },
  { name: "Okal", className: "font-medium italic" },
  { name: "Salvos", className: "font-normal tracking-tight" },
];

const featured = ["poutta-155", "ideal-133", "rehti-89"].map((slug) => houses.find((h) => h.slug === slug)!);

export default function HomeContent() {
  const { t } = useLang();
  const [lead, ...rest] = featured;

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <section className="grid grid-cols-12 gap-x-6 gap-y-10 pt-12 pb-24 md:pt-20 lg:items-end">
        <div className="col-span-12 lg:col-span-5 lg:pb-4">
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl">{t.home.title}</h1>
          <p className="mt-6 max-w-md text-lg text-navy/70">{t.home.lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/configure" className="bg-navy px-7 py-4 font-medium text-paper transition-colors hover:bg-periwinkle">
              {t.home.cta}
            </Link>
            <Link href="/houses" className="text-sm text-navy/70 underline underline-offset-4 hover:text-navy">
              {t.home.browse}
            </Link>
          </div>
        </div>
        <div className="relative col-span-12 aspect-[4/3] overflow-hidden lg:col-span-7">
          <Image src="/images/house-cover.jpg" alt="" fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="grid grid-cols-12 gap-x-6 gap-y-8 border-t border-navy/10 py-20">
        <div className="col-span-12 lg:col-span-4">
          <h2 className="text-2xl font-semibold tracking-tight">{t.home.buildersTitle}</h2>
          <p className="mt-3 max-w-sm text-slate">{t.home.buildersLead}</p>
        </div>
        <ul className="col-span-12 flex flex-wrap items-center gap-x-12 gap-y-6 text-2xl text-navy/60 lg:col-span-7 lg:col-start-6">
          {wordmarks.map((w) => (
            <li key={w.name} className={w.className}>{w.name}</li>
          ))}
        </ul>
      </section>

      <section className="border-t border-navy/10 py-20">
        <h2 className="text-2xl font-semibold tracking-tight">{t.home.housesTitle}</h2>
        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-12">
          <HouseFeature house={lead} className="col-span-12 lg:col-span-7" tall />
          <div className="col-span-12 grid gap-12 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((h) => (
              <HouseFeature key={h.slug} house={h} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-navy/10 py-20">
        <div className="col-span-12 lg:col-span-5">
          <h2 className="text-2xl font-semibold tracking-tight">{t.home.newsTitle}</h2>
          <p className="mt-3 max-w-sm text-slate">{t.home.newsLead}</p>
        </div>
        <NewsletterForm className="col-span-12 self-end lg:col-span-6 lg:col-start-7" />
      </section>
    </div>
  );
}

function HouseFeature({ house, className = "", tall }: { house: (typeof houses)[number]; className?: string; tall?: boolean }) {
  const { t } = useLang();
  return (
    <Link href={`/houses/${house.slug}`} className={`group block ${className}`}>
      <div className={`relative overflow-hidden bg-stone ${tall ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
        <Image src={house.image} alt={house.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-lg font-medium group-hover:underline group-hover:underline-offset-4">
          {house.name} <span className="font-normal text-slate">{t.home.by} {house.builder}</span>
        </p>
        <p className="text-slate">{t.home.from} {formatPrice(house.price)}</p>
      </div>
      <p className="mt-1 text-sm text-slate">
        {house.size} {t.home.size}, {t.home.bedrooms(house.bedrooms)}, {t.home.floors(house.floors)}
      </p>
    </Link>
  );
}
