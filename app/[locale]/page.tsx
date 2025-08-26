import { Metadata } from "next";

import IndexClientPage from "./client-page";

import { generateAlternates } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: generateAlternates({
      pathname: "/",
    }),
  };
}

export default function IndexPage() {
  return <IndexClientPage />;
}
