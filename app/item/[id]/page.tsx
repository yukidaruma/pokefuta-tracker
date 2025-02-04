import { Metadata, ResolvingMetadata } from "next";

import ItemClientPage from "./client-page";
import {
  getPokefutaData,
  getPokefutaImage,
  getPokemonName,
  getPrefectureName,
} from "@/util";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const pageId = Number(id);
  const pokefutaData = getPokefutaData(pageId);
  if (!pokefutaData) {
    return {};
  }

  return {
    title: `${getPrefectureName(pokefutaData.pref)}${
      pokefutaData.city
    } ${pokefutaData.pokemons
      .map(getPokemonName)
      .join("・")}のポケふた - Pokéfuta Tracker`,
    openGraph: {
      images: getPokefutaImage(pageId),
    },
  };
}

const ItemPage: React.FC = () => {
  return <ItemClientPage />;
};

export default ItemPage;
