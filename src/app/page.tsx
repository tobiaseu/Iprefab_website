import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";
import HouseCard from "@/components/HouseCard";
import HouseTypePicker from "@/components/HouseTypePicker";
import Marquee from "@/components/Marquee";
import { articles, builders, houses } from "@/data/houses";

function SectionHeader({ eyebrow, title, href, cta }: { eyebrow: string; title: string; href?: string; cta?: string }) {
  return (
    <div className="flex items-end justify-between gap-6 px-4 md:px-16 xl:px-32">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-periwinkle uppercase">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group flex shrink-0 items-center gap-2 text-sm font-medium">
          {cta}
          <span className="grid size-8 place-items-center rounded-full bg-navy text-white transition group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative min-h-[560px] overflow-hidden lg:min-h-[640px]">
        <HeroSlideshow />
        <div className="relative mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-20 md:px-16 lg:flex-row lg:items-center lg:justify-between lg:py-28 xl:px-32">
          <div className="max-w-[520px] text-white">
            <h1 className="text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
              Dream it. Build it. Live it.
            </h1>
            <p className="mt-6 max-w-[440px] text-lg text-white/85">
              Find your Finnish prefab home in minutes, matched to you by AI.
            </p>
          </div>
          <HouseTypePicker />
        </div>
      </section>

      <section className="py-20 md:py-28">
        <SectionHeader eyebrow="Featured" title="Houses you'll love" href="/houses" cta="All houses" />
        <Marquee duration={70} className="mt-10">
          {houses.map((h) => (
            <div key={h.slug} className="pr-6">
              <HouseCard house={h} size="sm" />
            </div>
          ))}
        </Marquee>
      </section>

      <section className="border-y border-navy/5 bg-white py-16 md:py-20">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-slate uppercase">
          Trusted Finnish builders
        </p>
        <Marquee duration={40} className="mt-10">
          {builders.map((b) => (
            <span
              key={b}
              className="px-10 text-5xl font-extrabold tracking-tight whitespace-nowrap text-navy/25 transition-colors hover:text-navy md:px-16 md:text-7xl"
            >
              {b}
            </span>
          ))}
        </Marquee>
      </section>

      <section className="mx-auto max-w-[1440px] py-20 md:py-28">
        <SectionHeader eyebrow="Magazine" title="Ideas & guides" href="/magazine" cta="Read more" />
        <div className="mt-10 grid gap-6 px-4 sm:grid-cols-2 md:px-16 lg:grid-cols-3 xl:px-32">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href="/magazine"
              className="group overflow-hidden rounded-3xl bg-white ring-1 ring-navy/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(7,20,56,0.35)]"
            >
              <div className="relative m-2 aspect-[2/1] overflow-hidden rounded-[18px]">
                <Image src={a.image} alt={a.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="px-5 pt-3 pb-6">
                <p className="text-xs text-slate">{a.date}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{a.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
