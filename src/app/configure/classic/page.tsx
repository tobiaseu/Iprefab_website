import { Suspense } from "react";
import ConfigureFromQuery from "@/components/configurator/ConfigureFromQuery";
import Configurator from "@/components/configurator/Configurator";

export const metadata = {
  title: "Configure step by step — Iprefab",
  description: "Answer a few questions and watch your prefab house take shape, then compare matching models from Finnish builders.",
};

export default function ClassicConfigurePage() {
  return (
    <Suspense fallback={<Configurator />}>
      <ConfigureFromQuery />
    </Suspense>
  );
}
