import Image from "next/image";
import PageHero from "@/components/PageHero";

export const metadata = { title: "About Us — House Finland" };

const team = [
  { name: "Sina Rahimi", role: "CEO", image: "/images/team-sina.png" },
  { name: "Siamak Rahimi", role: "CTO", image: "/images/team-siamak.png" },
  { name: "Payman Rahimi", role: "Mentor German Market", image: "/images/team-payman.png" },
  { name: "Hossein Shirazian", role: "Architecture Engineer", image: "/images/team-hossein.png" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" text="Three generations of real estate experience, now building the digital future of prefab homes.">
        <Image src="/images/legacy.png" alt="Reflection of legacy of real estate in tech" width={452} height={259} className="w-full max-w-[452px] rounded-2xl" />
      </PageHero>
      <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-32">
        <h2 className="text-[32px] font-semibold">Our Story</h2>
        <div className="mt-4 space-y-5 leading-7">
          <p>
            At Iprefab, we are more than a platform: we are the third generation of a real estate legacy that began in
            1969. What started with our grandfather&apos;s vision of building trustworthy, quality homes has evolved into a
            modern mission: to make homebuilding smarter, faster and more accessible across borders.
          </p>
          <p>
            Iprefab connects innovative manufacturers, landowners and homebuyers through a digital ecosystem designed for
            the future of construction. Our team blends real-world building expertise with cutting-edge digital tools,
            and has been shaped through some of Finland&apos;s most prestigious accelerator programs, including the NEXUS
            accelerator by the University of Helsinki and Business Generator at Aalto University Startup Center.
          </p>
          <p>
            Fueled by legacy and driven by innovation, Iprefab isn&apos;t just a company: it&apos;s the continuation of a
            family story, built with passion, powered by technology and rooted in trust. We&apos;re here to make building
            your dream home as easy as booking one.
          </p>
        </div>

        <h2 className="mt-16 text-[32px] font-semibold">Our Team</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 pb-12 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="rounded-2xl bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              <Image src={m.image} alt={m.name} width={240} height={240} className="aspect-square w-full rounded-xl object-cover" />
              <p className="mt-3 text-lg font-medium md:text-xl">{m.name}</p>
              <p className="text-xs text-slate">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
