import { Metadata } from "next";

import MapClientPage from "./client-page";

import { generateAlternates } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: generateAlternates({
      pathname: "/map",
    }),
  };
}

export default function MapPage() {
  return <MapClientPage />;
}
