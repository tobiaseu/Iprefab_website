"use client";

import { useEffect, useRef, useState } from "react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useTypewriter(lines: string[]) {
  const [text, setText] = useState(lines[0]);
  useEffect(() => {
    if (reduced()) return;
    let line = 0;
    let i = 0;
    let pause = 0;
    const id = window.setInterval(() => {
      if (pause > 0) return void pause--;
      i++;
      if (i > lines[line].length) {
        line = (line + 1) % lines.length;
        i = 0;
        pause = 4;
      }
      setText(lines[line].slice(0, i) || " ");
      if (i === lines[line].length) pause = 60;
    }, 45);
    return () => window.clearInterval(id);
  }, [lines]);
  return text;
}

/** Prompt text with chips that type phrases in at the caret, and toggle them back out. */
export function useComposer(initial = "") {
  const [text, setText] = useState(initial);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const has = (s: string) => !!s && text.toLowerCase().includes(s.toLowerCase());

  const strip = (src: string, s: string) => {
    if (!s) return src;
    const i = src.toLowerCase().indexOf(s.toLowerCase());
    if (i < 0) return src;
    return (src.slice(0, i) + src.slice(i + s.length)).replace(/\s*,\s*,/g, ",").replace(/^\s*,\s*|\s*,\s*$/g, "").trim();
  };

  const insert = (phrase: string, base = text) => {
    window.clearInterval(timer.current);
    const el = ref.current;
    const pos = el && document.activeElement === el ? (el.selectionStart ?? base.length) : base.length;
    const before = base.slice(0, pos).replace(/\s+$/, "");
    const after = base.slice(pos).replace(/^\s+/, "");
    const lead = before ? (/[,.;:]$/.test(before) ? " " : ", ") : "";
    const tail = after ? (/^[,.;:]/.test(after) ? "" : ", ") : "";
    const head = before + lead;
    const done = () => {
      const caret = head.length + phrase.length;
      requestAnimationFrame(() => {
        el?.focus();
        el?.setSelectionRange(caret, caret);
      });
    };
    if (reduced()) {
      setText(head + phrase + tail + after);
      return done();
    }
    let n = 0;
    timer.current = window.setInterval(() => {
      n++;
      setText(head + phrase.slice(0, n) + (n >= phrase.length ? tail + after : after ? " " + after : ""));
      if (n >= phrase.length) {
        window.clearInterval(timer.current);
        done();
      }
    }, 22);
  };

  const toggle = (s: string) => (has(s) ? setText((v) => strip(v, s)) : insert(s));
  const pick = (prev: string, next: string) => {
    const base = strip(text, prev);
    if (next) insert(next, base);
    else setText(base);
  };

  return { text, setText, ref, has, toggle, pick };
}
