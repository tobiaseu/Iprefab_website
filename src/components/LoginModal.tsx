"use client";

import { useEffect } from "react";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 text-navy"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="relative w-full max-w-[544px] rounded-2xl bg-white p-8 shadow-xl md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close" className="absolute top-5 right-5 text-slate hover:text-navy">
          <svg viewBox="0 0 24 24" className="size-6" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <h2 id="login-title" className="text-center text-[32px] font-medium">Log In</h2>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input type="email" required placeholder="name@email.com" className="rounded-xl border border-slate/50 px-4 py-3 text-base outline-none focus:border-periwinkle" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Password
            <input type="password" required placeholder="••••••••" className="rounded-xl border border-slate/50 px-4 py-3 text-base outline-none focus:border-periwinkle" />
          </label>
          <a href="#" className="self-end text-xs text-slate underline">Forgot password?</a>
          <button className="mt-2 h-12 rounded-[20px] bg-periwinkle text-xl font-medium text-white hover:brightness-95">
            Log In
          </button>
          <p className="text-center text-sm text-slate">
            Don&apos;t have an account? <a href="#" className="font-medium text-navy underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
