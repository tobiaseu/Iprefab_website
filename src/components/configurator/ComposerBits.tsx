export function Pill({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="relative inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.04] text-xs text-white/75 transition-colors hover:border-white/25 focus-within:border-white/40">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="cursor-pointer appearance-none bg-transparent py-1.5 pr-7 pl-3 outline-none">
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0d1c4a] text-white">{o.label}</option>
        ))}
      </select>
      <svg viewBox="0 0 12 12" className="pointer-events-none absolute right-2.5 size-3 text-white/50" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M3 4.5 6 7.5 9 4.5" /></svg>
    </label>
  );
}

export function Sparkle({ className = "size-4" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>;
}
