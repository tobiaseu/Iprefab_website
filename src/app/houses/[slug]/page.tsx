import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HouseCard from "@/components/HouseCard";
import { formatPrice, houses, houseTypes } from "@/data/houses";

export function generateStaticParams() {
  return houses.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps<"/houses/[slug]">) {
  const { slug } = await params;
  const house = houses.find((h) => h.slug === slug);
  return { title: house ? `${house.name} — House Finland` : "House — House Finland" };
}

export default async function HousePage({ params }: PageProps<"/houses/[slug]">) {
  const { slug } = await params;
  const house = houses.find((h) => h.slug === slug);
  if (!house) notFound();

  const others = houses.filter((h) => h.builder === house.builder && h.slug !== house.slug).slice(0, 3);
  const typeLabel = houseTypes.find((t) => t.value === house.type)?.label;

  const left: [string, string][] = [
    ["Name", house.name],
    ["Type", typeLabel ?? "House"],
    ["Builder", house.builder],
    ["Price", formatPrice(house.price)],
    ["House Area", `${house.size} m²`],
    ["Living Area", `${Math.round(house.size * 0.92)} m²`],
    ["Bedrooms", String(house.bedrooms)],
    ["Floors", String(house.floors)],
  ];
  const right: [string, string][] = [
    ["Material", "Laminated log"],
    ["Sauna", "Yes"],
    ["Balcony", house.floors > 1 ? "Yes" : "No"],
    ["Ceiling Style", "Double slope"],
    ["Facade", "Wooden"],
    ["Kitchen & Bath Appliances", "Included"],
    ["Builder Origin", "Finland"],
    ["Builder Experience", house.builder === "Finnlamelli" ? "29 years" : "40 years"],
  ];

  return (
    <>
      <div className="relative h-[280px] md:h-[420px]">
        <Image src={house.cover ?? house.image} alt={house.name} fill priority sizes="100vw" className="object-cover" />
      </div>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-10 md:px-32 lg:grid-cols-2">
          <div>
            <Link href="/houses" className="text-sm text-slate hover:underline">← All houses</Link>
            <h1 className="mt-3 text-[40px] font-semibold">{house.name}</h1>
            <p className="text-xl text-slate">{house.builder}</p>
            <p className="mt-2 text-2xl font-medium">{formatPrice(house.price)}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#" className="w-full rounded-2xl border border-slate px-6 py-3 text-center font-medium hover:bg-mist sm:w-64">Download Brochure</a>
              <a href="#" className="w-full rounded-2xl border border-slate px-6 py-3 text-center font-medium hover:bg-mist sm:w-64">Visit Builder</a>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-medium">Description</h2>
            <p className="mt-3 text-sm leading-6">
              {house.name} is a {typeLabel?.toLowerCase()} by {house.builder}, built with Finnish laminated log, a
              material born from the belief in its superiority in Alajärvi, Southern Ostrobothnia, where it has been
              produced for decades. With {house.bedrooms} bedrooms over {house.size} m², large windows and a warm
              timber facade, it is designed for bright, energy-efficient living all year round.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] pb-12">
          <h2 className="px-4 text-2xl font-medium md:px-32">Details</h2>
          <div className="mt-4 grid md:grid-cols-2">
            {[left, right].map((rows, i) => (
              <dl key={i} className={i === 0 ? "md:border-r md:border-mist" : ""}>
                {rows.map(([k, v], j) => (
                  <div key={k} className={`grid grid-cols-2 px-4 py-3 text-sm ${j % 2 === 0 ? "bg-mist" : ""} ${i === 0 ? "md:pl-32" : "md:pr-32"}`}>
                    <dt className="text-slate">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 py-12 pb-24 md:px-32">
          <h2 className="text-2xl font-medium">Other Houses From {house.builder}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((h) => <HouseCard key={h.slug} house={h} />)}
          </div>
        </section>
      )}
    </>
  );
}
