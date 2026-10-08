"use client";

import { useState, type RefObject } from "react";
import NewsletterForm from "@/components/NewsletterForm";
import { useLang } from "@/i18n/LanguageProvider";

async function downloadSvgAsPng(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const w = 1600;
  const h = 1200;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.removeAttribute("class");
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    const png = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (!png) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(png);
    a.download = "iprefab-house.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function ResultActions({ svgRef }: { svgRef: RefObject<SVGSVGElement | null> }) {
  const { t } = useLang();
  const [booked, setBooked] = useState(false);
  const field = "w-full border-b border-navy/30 bg-transparent py-2.5 outline-none focus:border-navy";

  return (
    <div className="space-y-10">
      <button
        type="button"
        onClick={() => svgRef.current && downloadSvgAsPng(svgRef.current)}
        className="bg-navy px-6 py-3.5 font-medium text-paper transition-colors hover:bg-periwinkle"
      >
        {t.cfg.download}
      </button>

      <div>
        <h3 className="font-semibold">{t.cfg.bookTitle}</h3>
        <p className="mt-1 text-sm text-slate">{t.cfg.bookLead}</p>
        {booked ? (
          <p className="mt-4 text-moss">{t.cfg.booked}</p>
        ) : (
          <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setBooked(true); }}>
            <label className="text-sm text-slate">
              {t.cfg.name}
              <input required className={`${field} text-navy`} autoComplete="name" />
            </label>
            <label className="text-sm text-slate">
              {t.cfg.email}
              <input required type="email" className={`${field} text-navy`} autoComplete="email" />
            </label>
            <label className="text-sm text-slate">
              {t.cfg.date}
              <input type="date" className={`${field} text-navy`} />
            </label>
            <div className="flex items-end">
              <button type="submit" className="border border-navy px-5 py-2.5 font-medium transition-colors hover:bg-navy hover:text-paper">
                {t.cfg.book}
              </button>
            </div>
          </form>
        )}
      </div>

      <div>
        <h3 className="font-semibold">{t.cfg.newsTitle}</h3>
        <NewsletterForm className="mt-2" />
      </div>
    </div>
  );
}
