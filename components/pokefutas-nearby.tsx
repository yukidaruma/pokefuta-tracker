import {
  getNearbyPokefutas,
  getPrefectureName,
  type PokefutaData,
} from "@/util";
import Link from "next/link";
import PokefutaImage from "./pokefuta-image";
import { useProgressStorage } from "@/hooks";

const PokefutasNearby: React.FC<{
  progress: ReturnType<typeof useProgressStorage>[0];
  pokefutaData?: PokefutaData;
  lat?: number;
  lng?: number;
}> = ({ progress, pokefutaData, lat, lng }) => {
  const nearby = getNearbyPokefutas(
    6,
    pokefutaData ? Number(pokefutaData.coords[0]) : lat!,
    pokefutaData ? Number(pokefutaData.coords[1]) : lng!,
    pokefutaData?.id
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {nearby.map((pokefuta) => {
        const hasVisited = progress[pokefuta.id];

        return (
          <Link
            key={pokefuta.id}
            href={`/item/${pokefuta.id}`}
            className={`flex items-center p-2 space-x-2 rounded-lg shadow ${
              hasVisited ? "bg-green-50" : ""
            }`}
          >
            <PokefutaImage id={pokefuta.id} size={80} />
            <div className="flex flex-col">
              <span>
                {getPrefectureName(pokefuta.pref)} {pokefuta.city}
              </span>
              <span className="text-sm text-gray-600">
                {pokefuta.distance.toFixed(1)} km
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PokefutasNearby;
