import Accordion from "@/components/Accordion";
import PageHero from "@/components/PageHero";
import { services } from "@/data/services";

export const metadata = { title: "Services — House Finland" };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Services"
        text="From the first idea to the building permit: our consultants and AI tools support you at every step of your prefab home project."
      />
      <section className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-16 pb-24 md:px-32">
        {services.map((s, i) => (
          <Accordion key={s.title} title={s.title} color={s.color} defaultOpen={i === 0}>
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
              <div>
                <h3 className="text-xl">Main Features</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
                  {s.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {s.plans.map((p) => (
                  <div key={p.name} className="flex flex-col rounded-2xl border-2 p-4" style={{ borderColor: s.color }}>
                    <p className="text-xl">{p.name}</p>
                    <p className="mt-6 flex-1 text-2xl font-medium">{p.price}</p>
                    <a href="#" className="mt-6 rounded-2xl border border-slate py-2 text-center font-medium hover:bg-mist">{p.cta}</a>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>
        ))}
      </section>
    </>
  );
}
