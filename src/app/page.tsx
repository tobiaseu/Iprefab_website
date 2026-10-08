import Image from "next/image";
import Link from "next/link";
import HouseCard from "@/components/HouseCard";
import HouseTypePicker from "@/components/HouseTypePicker";
import { articles, builders, houses } from "@/data/houses";

const builderStyles: Record<string, string> = {
  OKAL: "bg-white text-slate tracking-[0.2em]",
  HONKA: "bg-[#ffd500] text-black font-black tracking-wider",
  DESIGNTALO: "bg-white text-black font-extrabold tracking-wide",
  SALVOS: "bg-black text-white font-black text-3xl lowercase",
  IPREFAB: "bg-[#4d4b4c] text-white tracking-[0.3em]",
  FINNLAMELLI: "bg-white text-black font-bold tracking-wider",
};

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Image src="/images/hero.png" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 py-12 md:px-32 lg:flex-row lg:justify-between">
          <div className="max-w-[560px] text-white">
            <h1 className="text-[32px] font-semibold md:text-[40px]">Dream It, Build It, Live It.</h1>
            <p className="mt-6 text-lg md:text-xl">
              Find your dream house with HouseParky. Complete the form to log in and instantly access the best home
              options tailored to you thanks to our AI-powered, personalized matchmaking.
            </p>
          </div>
          <HouseTypePicker />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] py-10">
        <div className="flex items-center justify-between px-4 md:px-32">
          <h2 className="text-[32px] font-medium">Houses</h2>
          <Link href="/houses" className="rounded-2xl border border-slate bg-white px-4 py-1 font-medium hover:bg-mist">
            More Houses
          </Link>
        </div>
        <div className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto px-4 py-4 md:px-32">
          {houses.map((h) => (
            <div key={h.slug} className="snap-start">
              <HouseCard house={h} size="sm" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] pb-10">
        <h2 className="px-4 text-[32px] font-medium md:px-32">Builders</h2>
        <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto px-4 pb-4 md:px-32">
          {builders.map((b) => (
            <div
              key={b}
              className={`flex h-20 w-60 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${builderStyles[b]}`}
            >
              {b === "SALVOS" ? "salvos" : b}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-24 md:px-32">
        <h2 className="text-[32px] font-medium">Magazine</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href="/magazine"
              className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[2/1]">
                <Image src={a.image} alt={a.title} fill sizes="(max-width: 768px) 100vw, 384px" className="object-cover" />
              </div>
              <div className="px-4 py-3">
                <h3 className="text-xl font-medium">{a.title}</h3>
                <p className="truncate text-[11px] text-slate">{a.excerpt}</p>
                <p className="mt-4 text-[11px] text-slate">📅 {a.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
