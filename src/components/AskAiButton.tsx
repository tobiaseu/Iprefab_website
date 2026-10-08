"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatIcon } from "./Icons";

type Msg = { from: "ai" | "me"; text: string };

const reply = (q: string) => {
  const t = q.toLowerCase();
  if (t.includes("price") || t.includes("cost") || t.includes("€"))
    return "Our houses start from around €160.000 for a 90 m² model. Tell me your budget and I'll show you the best matches.";
  if (t.includes("cabin") || t.includes("holiday"))
    return "Holiday and cabin houses are perfect for lakeside plots. Would you like to see models under 100 m²?";
  if (t.includes("permit") || t.includes("zoning"))
    return "Our Site Zoning & Permit consultancy guides you step by step through the building permit in your municipality.";
  return "Great question! Log in and complete the form so I can match you with the best houses and builders for your needs.";
};

export default function AskAiButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: "Hi! I'm the Iprefab AI consultant. How can I help you find your dream house?" },
  ]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "me", text: q }, { from: "ai", text: reply(q) }]);
    setInput("");
  };

  // The home page and the configurator have their own guide, so keep them quiet.
  if (pathname === "/" || pathname.startsWith("/configure")) return null;
  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-24 z-40 flex h-[480px] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl glass shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3 text-white">
            <p className="font-medium">AI Consultant</p>
            <button onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 text-sm">
            {msgs.map((m, i) => (
              <p
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 ${m.from === "ai" ? "self-start bg-mist" : "self-end bg-[#4a5cf0] text-white"}`}
              >
                {m.text}
              </p>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-mist p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-full border border-slate/40 px-4 py-2 text-sm outline-none focus:border-periwinkle"
            />
            <button className="rounded-full bg-[#4a5cf0] px-4 text-sm text-white">Send</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 bottom-6 z-40 flex h-[64px] w-[64px] flex-col items-center justify-center rounded-2xl bg-[#4a5cf0] text-white ring-1 ring-white/20 shadow-lg transition-transform hover:scale-105"
      >
        <ChatIcon className="size-6" />
        <span className="text-sm font-bold">Ask AI</span>
      </button>
    </>
  );
}
