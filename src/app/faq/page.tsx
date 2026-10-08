import Accordion from "@/components/Accordion";
import PageHero from "@/components/PageHero";

export const metadata = { title: "FAQ — House Finland" };

const faq = [
  { group: "General", items: [
    ["What is House Finland?", "House Finland is a marketplace powered by Iprefab that connects you with the best Finnish prefab house builders and matches you with homes that fit your needs."],
    ["Do I need an account?", "You can browse houses freely. Creating an account unlocks AI matchmaking, favourites, comparisons and free consultations."],
  ]},
  { group: "Cost & Financing", items: [
    ["How much does a prefab house cost?", "Prices on House Finland start from around €160.000 for a 90 m² model. The final cost depends on size, customisation, plot and foundations."],
    ["Can you help with financing?", "Yes. Our Financial & Project Planning Consultancy helps you compare mortgage options and build a realistic budget."],
  ]},
  { group: "Design & Customization", items: [
    ["Can I choose the style and interior finishes?", "Most models can be customised: floor plan, facade, materials and interior finishes are all discussed with the builder."],
    ["Do you offer interior design services?", "Yes, interior design and modular planning are part of our General Consultancy."],
    ["Are eco-friendly materials available?", "Finnish builders use sustainable timber and laminated log, and many models meet high energy-efficiency standards."],
  ]},
  { group: "Services & Support", items: [
    ["Is there a free consultation included?", "Members get a free 30-minute consultation with one of our experts."],
    ["Can I choose between an architect and an interior designer?", "Yes, when you book a consultation you can choose the specialist that fits your project."],
    ["How long does it take to build and install a prefab home?", "Production usually takes a few months; installation on site can take only a few weeks once the foundations are ready."],
  ]},
];

export default function FaqPage() {
  return (
    <>
      <PageHero title="FAQ" text="Everything you need to know about buying, customising and building your prefab house in Finland." />
      <section className="mx-auto max-w-[1440px] space-y-10 px-4 py-16 pb-24 md:px-32">
        {faq.map((g) => (
          <div key={g.group}>
            <h2 className="text-2xl font-medium">{g.group}</h2>
            <div className="mt-4 space-y-3">
              {g.items.map(([q, a]) => (
                <Accordion key={q} title={q}>
                  <p className="text-sm leading-6 text-slate">{a}</p>
                </Accordion>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
