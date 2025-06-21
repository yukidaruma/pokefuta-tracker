import PokefutaImage from "./pokefuta-image";
import Link from "@/components/link";
import { useTranslation } from "@/i18n-client";
import { useSearchContext } from "@/providers/search";
import {
  getNearbyPokefutas,
  getPrefectureByCode,
  getTranslatedCityName,
  type PokefutaData,
} from "@/util";

const PokefutasNearby: React.FC<{
  pokefutaData?: PokefutaData;
  filteredPokefutas?: PokefutaData[];
  lat?: number;
  lng?: number;
}> = ({ pokefutaData, filteredPokefutas, lat, lng }) => {
  const { t, i18n } = useTranslation();
  const { progress } = useSearchContext();
  const nearbyPokefutas = getNearbyPokefutas(
    6,
    pokefutaData ? Number(pokefutaData.coords[0]) : lat!,
    pokefutaData ? Number(pokefutaData.coords[1]) : lng!,
    {
      ignoreId: pokefutaData?.id,
      filteredPokefutas: filteredPokefutas,
    }
  );

  const isEnglish = i18n.language === "en";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {nearbyPokefutas.length > 0 ? (
        nearbyPokefutas.map((pokefuta) => {
          const hasVisited = progress[pokefuta.id];

          return (
            <Link
              key={pokefuta.id}
              href={`/item/${pokefuta.id}`}
              className={`flex items-center p-2 space-x-2 rounded-lg shadow ${
                hasVisited ? "bg-green-50" : ""
              }`}
            >
              <PokefutaImage id={pokefuta.id} size={80} isSprite />
              <div className="flex flex-col">
                <span>
                  {t("title_item_address", {
                    pref: (t as any)(
                      `pref_${getPrefectureByCode(pokefuta.pref)!.name}`
                    ),
                    city: getTranslatedCityName(pokefuta.city, isEnglish),
                  })}
                </span>
                <span className="text-sm text-gray-600">
                  {pokefuta.distance.toFixed(1)} km
                </span>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="text-gray-500">{t("no_pokefutas_found")}</div>
      )}
    </div>
  );
};

export default PokefutasNearby;
