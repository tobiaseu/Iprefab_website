"use client";

import { useSearchParams } from "next/navigation";
import Configurator from "./Configurator";

export default function ConfigureFromQuery() {
  const q = (useSearchParams().get("q") ?? "").trim().slice(0, 400);
  // Remount when the request changes so the prefilled answers follow it.
  return <Configurator key={q} q={q} />;
}
