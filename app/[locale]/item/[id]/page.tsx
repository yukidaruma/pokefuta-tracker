import { Metadata, ResolvingMetadata } from "next";

import ItemClientPage from "./client-page";

import data from "@/data/data.json";
import { useTranslation } from "@/i18n/server";
import { locales } from "@/i18n/constants";
import {
  getPokefutaData,
  getPokefutaImage,
  getPokemonNamesCombined,
  getPrefectureByCode,
  getTranslatedCityName,
} from "@/utils/pokefuta";

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, id } = await params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
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

export function generateStaticParams() {
  const params = [];

  for (const locale of locales) {
    for (const item of data.list) {
      params.push({
        locale,
        id: item.id.toString(),
      });
    }
  }

  return params;
}

const ItemPage: React.FC = async () => {
  return <ItemClientPage />;
};

export default ItemPage;
