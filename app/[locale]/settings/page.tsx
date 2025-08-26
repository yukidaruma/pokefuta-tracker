import { Metadata } from "next";

import SettingsClientPage from "./client-page";

import { generateAlternates } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: generateAlternates({
      pathname: "/settings",
    }),
  };
}

export default function SettingsPage() {
  return <SettingsClientPage />;
}
