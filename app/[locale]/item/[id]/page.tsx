import { Metadata, ResolvingMetadata } from "next";

import ItemClientPage from "./client-page";
import {
  getPokefutaData,
  getPokefutaImage,
  getPokemonName,
  getPokemonNamesCombined,
  getPrefectureByCode,
  getTranslatedCityName,
} from "@/util";
import { useTranslation } from "@/i18n";

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, id } = await params;
  const { t, i18n } = await useTranslation(locale, ["common"]);
  const pageId = Number(id);
  const pokefutaData = getPokefutaData(pageId);
  if (!pokefutaData) {
    return {};
  }

  const prefName = (t as any)(
    `pref_${getPrefectureByCode(pokefutaData.pref)!.name}`
  );
  const isEnglish = i18n.language === "en";
  const title =
    t("title_item_address", {
      pref: prefName,
      city: getTranslatedCityName(pokefutaData.city, isEnglish),
    }) +
    " - " +
    t("title_item_pokemons", {
      pokemons: getPokemonNamesCombined(pokefutaData.pokemons, isEnglish),
    }) +
    " - Pokéfuta Tracker";

  return {
    title,
    openGraph: {
      images: getPokefutaImage(pageId),
    },
  };
}

const ItemPage: React.FC = async () => {
  return <ItemClientPage />;
};

export default ItemPage;
