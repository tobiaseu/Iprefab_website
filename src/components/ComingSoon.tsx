import Link from "next/link";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-32 text-center">
      <h1 className="text-[40px] font-semibold">{title}</h1>
      <p className="mt-4 max-w-md text-slate">This section is being built. In the meantime, explore our houses.</p>
      <Link href="/houses" className="mt-8 rounded-[20px] bg-periwinkle px-8 py-3 text-xl font-medium text-white">
        Browse Houses
      </Link>
    </section>
  );
}
