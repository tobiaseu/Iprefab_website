import Link from "next/link";
import { SocialIcon } from "./Icons";
import Logo from "./Logo";

const columns = [
  { title: "Homepage", href: "/", links: ["Houses", "Builders", "Magazine"] },
  { title: "Houses", href: "/houses", links: ["Search Houses", "Detached Houses", "Holiday Houses", "Cabin Houses"] },
  { title: "Magazine", href: "/magazine", links: ["Blog", "Articles", "News"] },
  { title: "Services", href: "/services", links: ["General Consultancy", "AI Consultancy", "Architect Consultancy", "Financial & Project Planning", "Site Zoning & Permit"] },
  { title: "FAQ", href: "/faq", links: ["General", "Cost & Financing", "Design & Customization", "Services & Support"] },
  { title: "About Us", href: "/about", links: ["Who We Are", "Our Story", "Our Team", "Our Partners"] },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-20 md:px-16 xl:px-32 lg:grid-cols-[1fr_2fr]">
        <div>
          <div className="flex items-center gap-4">
            <Logo className="h-14 w-auto" />
            <div>
              <p className="text-[32px] leading-none font-semibold">House Finland</p>
              <p className="mt-1 text-xl font-medium">Powered By Iprefab</p>
            </div>
          </div>
          <p className="mt-6 font-medium">Follow Us</p>
          <div className="mt-3 flex gap-3">
            {(["instagram", "x", "youtube", "linkedin"] as const).map((s) => (
              <a key={s} href="#" aria-label={s} className="hover:opacity-80">
                <SocialIcon name={s} className="size-8" />
              </a>
            ))}
          </div>
          <p className="mt-6 font-medium">B2B Partners</p>
          <a href="https://iprefab.ai" className="mt-3 inline-block rounded-full bg-periwinkle px-4 py-1 text-sm">
            iprefab.ai
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-6">
          {columns.map((col) => (
            <div key={col.title}>
              <Link href={col.href} className="font-semibold uppercase">{col.title}</Link>
              <ul className="mt-5 space-y-4 text-[11px]">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href={col.href} className="hover:underline">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
