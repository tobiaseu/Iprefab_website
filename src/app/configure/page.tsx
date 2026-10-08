import { Suspense } from "react";
import StudioFromQuery from "@/components/configurator/StudioFromQuery";
import Studio from "@/components/configurator/Studio";

export const metadata = {
  title: "Configure your home — Iprefab",
  description: "Shape your prefab house as a live 3D frame: size, floors, roof, colours and extras, with an instant price estimate.",
};

export default function ConfigurePage() {
  return (
    <Suspense fallback={<Studio />}>
      <StudioFromQuery />
    </Suspense>
  );
}
