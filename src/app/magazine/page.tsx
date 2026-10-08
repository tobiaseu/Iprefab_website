import Image from "next/image";
import PageHero from "@/components/PageHero";
import { articles } from "@/data/houses";

export const metadata = { title: "Magazine — Iprefab" };

export default function MagazinePage() {
  return (
    <>
      <PageHero title="Magazine" text="Guides, news and insights on prefab construction, materials and building your home in Finland." />
      <section className="mx-auto grid max-w-[1440px] gap-4 px-4 py-16 pb-24 sm:grid-cols-2 md:px-32 lg:grid-cols-3">
        {articles.map((a) => (
          <article key={a.slug} className="overflow-hidden glass rounded-3xl">
            <div className="relative aspect-[2/1]">
              <Image src={a.image} alt={a.title} fill sizes="(max-width: 768px) 100vw, 384px" className="object-cover" />
            </div>
            <div className="px-4 py-3">
              <h2 className="text-xl font-medium">{a.title}</h2>
              <p className="text-[11px] text-slate">{a.excerpt}</p>
              <p className="mt-4 text-[11px] text-slate">📅 {a.date}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
