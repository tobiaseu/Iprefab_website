export default function PageHero({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <section className="bg-gradient-to-r from-navy to-[#1e2a5a] text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-16 md:px-32 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[640px]">
          <h1 className="text-[40px] font-semibold">{title}</h1>
          <p className="mt-4 text-lg">{text}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
