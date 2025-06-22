import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import { useLongPress } from "@mantine/hooks";
import React from "react";

import Link from "./link";
import PokefutaImage from "@/components/pokefuta-image";
import { getPokemonName, getTranslatedCityName, PokefutaData } from "@/util";

export const PokefutaCard: React.FC<{
  isEnglish: boolean;
  pokefuta: PokefutaData;
  progress: Record<number, boolean>;
  updateProgress?: (id: number, visited: boolean) => void;
  children?: React.ReactNode;
}> = ({ isEnglish, pokefuta, progress, updateProgress, children }) => {
  const disableLink = React.useRef(false);

  const names = pokefuta.pokemons
    .map((num) => getPokemonName(num, isEnglish))
    .join(", ");
  const hasVisited = progress[pokefuta.id] ?? false;
  const handlers = useLongPress(
    () => {
      disableLink.current = true;
      updateProgress?.(pokefuta.id, !hasVisited);
    },
    {
      threshold: 500,
    }
  );

  return (
    <Link
      onClick={(e) => {
        if (disableLink.current) {
          disableLink.current = false;
          e.preventDefault();
        }
      }}
      key={pokefuta.id}
      href={`/item/${pokefuta.id}`}
      className={`flex space-x-2 p-4 rounded-lg shadow select-none ${
        hasVisited ? "bg-green-50" : ""
      }`}
      prefetch={false}
      onContextMenu={
        /* Disable context menu on Android */
        (e) => e.preventDefault()
      }
      style={{
        WebkitTouchCallout: "none", // Disable long press menu on iOS
      }}
      {...handlers}
    >
      <PokefutaImage id={pokefuta.id} size={72} isSprite />
      <div>
        <p>
          {getTranslatedCityName(pokefuta.city, isEnglish)} {children}
        </p>
        <p className="text-sm text-gray-600">{names}</p>
      </div>
      <Mantine.Box flex={1} />
      <Lucide.ChevronRight className="self-center" />
    </Link>
  );
};
