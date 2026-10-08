import { Suspense } from "react";
import HouseSearch from "./HouseSearch";

export const metadata = { title: "Houses — Iprefab" };

export default function HousesPage() {
  return (
    <Suspense>
      <HouseSearch />
    </Suspense>
  );
}
