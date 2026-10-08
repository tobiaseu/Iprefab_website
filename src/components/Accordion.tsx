"use client";

import { useState } from "react";

export default function Accordion({
  title,
  color,
  children,
  defaultOpen = false,
}: {
  title: string;
  color?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
      {color && <div className="h-3" style={{ background: color }} />}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 px-6 py-4 text-left ${color ? "justify-center text-center" : ""}`}
      >
        <span className={color ? `w-full text-xl font-semibold ${open ? "text-navy" : "text-slate"}` : "font-medium"}>{title}</span>
        {!color && <span className="text-xl">{open ? "−" : "+"}</span>}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}
