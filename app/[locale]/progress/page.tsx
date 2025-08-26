import { Metadata } from "next";

import ProgressClientPage from "./client-page";

import { generateAlternates } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: generateAlternates({
      pathname: "/progress",
    }),
  };
}

const ProgressPage: React.FC<{ params: Promise<{ locale: string }> }> = ({
  params,
}) => {
  return <ProgressClientPage params={params} />;
};

export default ProgressPage;
