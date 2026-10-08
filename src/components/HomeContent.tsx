"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, houses, houseTypes, type House } from "@/data/houses";
import { useLang } from "@/i18n/LanguageProvider";
import HouseCard from "./HouseCard";
import Marquee from "./Marquee";
import NewsletterForm from "./NewsletterForm";
import { ArrowCircle } from "./Icons";
import { Sparkle } from "./configurator/ComposerBits";

const wordmarks = [
  { name: "Finnlamelli", className: "font-semibold tracking-tight" },
  { name: "Designtalo", className: "font-light tracking-wide" },
  { name: "Honka", className: "font-bold tracking-[0.12em]" },
  { name: "Okal", className: "font-medium italic" },
  { name: "Salvos", className: "font-normal tracking-tight" },
];
const featured = ["poutta-155", "aava-140", "ideal-133", "shine-133", "rehti-89", "ideal-105"].map((slug) => houses.find((h) => h.slug === slug)!);

/** Large photo card with its details on a glass panel inside the image. */
function FeatureCard({ house }: { house: House }) {
  const { t } = useLang();
  return (
    <article className="group relative aspect-[4/5] w-[78vw] max-w-[380px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-white/10 sm:aspect-[4/5]">
      <Image src={house.cover ?? house.image} alt="" fill sizes="(max-width: 640px) 78vw, 380px" className="object-cover transition duration-700 group-hover:scale-105" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#071438]/80 via-transparent to-transparent" />
      <div className="glass absolute inset-x-3 bottom-3 rounded-[20px] p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">
            <Link href={`/houses/${house.slug}`} className="after:absolute after:inset-0">{house.name}</Link>
          </h3>
          <p className="shrink-0 font-medium text-[#c9d1ff] tabular-nums">{formatPrice(house.price)}</p>
        </div>
        <p className="mt-1 text-sm text-white/65">{house.builder} · {house.size} m² · {t.home.floors(house.floors)}</p>
      </div>
    </article>
  );
}

function Row({ title, lead, href, viewAll, children }: { title: string; lead?: string; href: string; viewAll: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 md:px-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{title}</h2>
          {lead && <p className="mt-1.5 text-white/60">{lead}</p>}
        </div>
        <Link href={href} className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">{viewAll}<span aria-hidden>→</span></Link>
      </div>
      <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:gap-5 md:px-8">{children}</div>
    </section>
  );
}

export default function HomeContent() {
  const { t } = useLang();
  const h = t.home;

  return (
    <div className="lyra-bg relative -mt-16 overflow-x-clip pt-16 text-white md:-mt-20 md:pt-20">
      {/* Hero: one statement, two ways in */}
      <section className="relative mx-auto flex min-h-[72svh] max-w-5xl flex-col items-center justify-center px-4 pt-12 pb-20 text-center md:pt-20 md:pb-28">
        <h1 className="text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance md:text-[5.5rem]">
          {h.h1a} {h.h1b}
        </h1>
        <p className="mt-7 max-w-xl text-base text-pretty text-white/65 md:text-lg">{h.sub}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/configure" className="inline-flex items-center gap-3 rounded-full bg-[#4a5cf0] py-1.5 pr-1.5 pl-6 font-medium shadow-[0_10px_30px_-10px_#4a5cf0] transition-colors hover:bg-[#5b6cf0]">
            {h.cta}<ArrowCircle />
          </Link>
          <Link href="/houses" className="glass inline-flex items-center rounded-full px-6 py-2.5 font-medium transition-colors hover:bg-white/10">{h.browseShort}</Link>
        </div>
      </section>

      <Row title={h.suggestedTitle} lead={h.suggestedLead} href="/houses" viewAll={h.viewAll}>
        {featured.map((hs) => <FeatureCard key={hs.slug} house={hs} />)}
      </Row>

      {houseTypes.map((ty) => {
        const list = houses.filter((x) => x.type === ty.value);
        if (!list.length) return null;
        return (
          <Row key={ty.value} title={h.types[ty.value]} href={`/houses?type=${ty.value}`} viewAll={h.viewAll}>
            {list.map((hs) => (
              <div key={hs.slug} className="flex snap-start">
                <HouseCard house={hs} size="sm" dark />
              </div>
            ))}
          </Row>
        );
      })}

      {/* Builders marquee */}
      <section className="relative mt-10 border-y border-white/[0.06] py-14">
        <h2 className="relative px-4 text-center text-sm font-medium text-white/70 md:text-base">{h.marqueeTitle}</h2>
        <Marquee duration={45} className="relative mt-8">
          {wordmarks.map((w) => (
            <span key={w.name} className={`flex items-center gap-3 px-8 text-3xl whitespace-nowrap text-white/40 md:px-12 md:text-4xl ${w.className}`}>
              <Sparkle className="size-5 opacity-60" />{w.name}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-24">
        <div className="glass grid gap-6 rounded-3xl p-6 md:grid-cols-2 md:items-end md:p-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{h.newsTitle}</h2>
            <p className="mt-2 max-w-sm text-white/65">{h.newsLead}</p>
          </div>
          <NewsletterForm dark />
        </div>
      </section>
    </div>
  );
}
