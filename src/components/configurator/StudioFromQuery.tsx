"use client";

import { useSearchParams } from "next/navigation";
import Studio from "./Studio";

export default function StudioFromQuery() {
  const q = (useSearchParams().get("q") ?? "").trim().slice(0, 400);
  return <Studio key={q} q={q} />;
}
