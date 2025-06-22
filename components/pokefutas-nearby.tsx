import { useTranslation } from "@/i18n-client";
import { useSearchContext } from "@/providers/search";
import { getNearbyPokefutas, type PokefutaData } from "@/util";
import { PokefutaCard } from "./pokefuta-card";

const PokefutasNearby: React.FC<{
  pokefutaData?: PokefutaData;
  count?: number;
  filteredPokefutas?: PokefutaData[];
  lat?: number;
  lng?: number;
  maxDistance?: number; // in km
}> = ({
  pokefutaData,
  count = 6,
  filteredPokefutas,
  lat,
  lng,
  maxDistance,
}) => {
  const { t, i18n } = useTranslation();
  const { progress, updateProgress } = useSearchContext();
  const nearbyPokefutas = getNearbyPokefutas(
    count,
    pokefutaData ? Number(pokefutaData.coords[0]) : lat!,
    pokefutaData ? Number(pokefutaData.coords[1]) : lng!,
    {
      ignoreId: pokefutaData?.id,
      filteredPokefutas,
      maxDistance,
    }
  );

  const isEnglish = i18n.language === "en";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {nearbyPokefutas.length > 0 ? (
        nearbyPokefutas.map((pokefuta) => {
          return (
            <PokefutaCard
              key={pokefuta.id}
              isEnglish={isEnglish}
              pokefuta={pokefuta}
              progress={progress}
              updateProgress={updateProgress}
            >
              <span className="text-xs text-gray-600">
                {pokefuta.distance.toFixed(1)} km
              </span>
            </PokefutaCard>
          );
        })
      ) : (
        <div className="text-gray-500">{t("no_pokefutas_found")}</div>
      )}
    </div>
  );
};

export default PokefutasNearby;
